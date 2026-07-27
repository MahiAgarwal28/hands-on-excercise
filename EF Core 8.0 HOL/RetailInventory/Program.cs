using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using EFCore.BulkExtensions;
using RetailInventory;

class Program
{
    private static readonly Func<AppDbContext, decimal, IAsyncEnumerable<Product>> _expensiveProducts =
        EF.CompileAsyncQuery((AppDbContext ctx, decimal price) =>
            ctx.Products.Where(p => p.Price > price));

    static async Task Main(string[] args)
    {
        using var context = new AppDbContext();

        context.Products.RemoveRange(context.Products);
        context.Categories.RemoveRange(context.Categories);
        await context.SaveChangesAsync();

        var electronics = new Category { Name = "Electronics" };
        var groceries = new Category { Name = "Groceries" };

        await context.Categories.AddRangeAsync(electronics, groceries);

        var product1 = new Product { Name = "Laptop", Price = 75000, Category = electronics, StockQuantity = 10 };
        var product2 = new Product { Name = "Rice Bag", Price = 1200, Category = groceries, StockQuantity = 25 };

        await context.Products.AddRangeAsync(product1, product2);
        await context.SaveChangesAsync();

        Console.WriteLine("--- Retrieve All Products ---");
        var productsList = await context.Products.ToListAsync();
        foreach (var p in productsList)
        {
            Console.WriteLine($"{p.Name} - {p.Price}");
        }

        Console.WriteLine("\n--- Find by ID ---");
        var productById = await context.Products.FindAsync(product1.Id);
        Console.WriteLine($"Found: {productById?.Name}");

        Console.WriteLine("\n--- FirstOrDefault with Condition ---");
        var expensiveProduct = await context.Products.FirstOrDefaultAsync(p => p.Price > 50000);
        Console.WriteLine($"Expensive: {expensiveProduct?.Name}");

        Console.WriteLine("\n--- Lab 6: Update a Product ---");
        var productToUpdate = await context.Products.FirstOrDefaultAsync(p => p.Name == "Laptop");
        if (productToUpdate != null)
        {
            productToUpdate.Price = 70000;
            await context.SaveChangesAsync();
            Console.WriteLine($"Updated {productToUpdate.Name} price to: {productToUpdate.Price}");
        }

        Console.WriteLine("\n--- Lab 6: Delete a Product ---");
        var toDelete = await context.Products.FirstOrDefaultAsync(p => p.Name == "Rice Bag");
        if (toDelete != null)
        {
            context.Products.Remove(toDelete);
            await context.SaveChangesAsync();
            Console.WriteLine($"Deleted product: Rice Bag");
        }

        Console.WriteLine("\n--- Lab 7: Filter and Sort ---");
        var filtered = await context.Products
            .Where(p => p.Price > 1000)
            .OrderByDescending(p => p.Price)
            .ToListAsync();
        foreach (var f in filtered)
        {
            Console.WriteLine($"{f.Name} - {f.Price}");
        }

        Console.WriteLine("\n--- Lab 7: Project into DTO ---");
        var productDTOs = await context.Products
            .Select(p => new { p.Name, p.Price })
            .ToListAsync();
        foreach (var dto in productDTOs)
        {
            Console.WriteLine($"DTO: {dto.Name} | {dto.Price}");
        }

        Console.WriteLine("\n--- Lab 10: Eager Loading ---");
        var eagerProducts = await context.Products.Include(p => p.Category).ToListAsync();
        foreach (var p in eagerProducts)
        {
            Console.WriteLine($"Product: {p.Name} | Category: {p.Category?.Name}");
        }

        Console.WriteLine("\n--- Lab 10: Explicit Loading ---");
        var explicitProduct = await context.Products.FirstAsync();
        await context.Entry(explicitProduct).Reference(p => p.Category).LoadAsync();
        Console.WriteLine($"Product: {explicitProduct.Name} | Loaded Category: {explicitProduct.Category?.Name}");

        Console.WriteLine("\n--- Lab 12: Project into Custom DTO Class ---");
        var customProductDTOs = await context.Products
            .Select(p => new ProductDTO
            {
                Name = p.Name,
                CategoryName = p.Category.Name
            })
            .ToListAsync();
        foreach (var dto in customProductDTOs)
        {
            Console.WriteLine($"Product Class DTO: {dto.Name} | Category: {dto.CategoryName}");
        }

        Console.WriteLine("\n--- Lab 13: AsNoTracking ---");
        var trackingProducts = await context.Products.AsNoTracking().ToListAsync();
        foreach (var p in trackingProducts)
        {
            Console.WriteLine($"No-Tracking Product: {p.Name}");
        }

        Console.WriteLine("\n--- Lab 13: Compiled Query ---");
        await foreach (var p in _expensiveProducts(context, 10000))
        {
            Console.WriteLine($"Compiled Query Match: {p.Name} | Price: {p.Price}");
        }

        Console.WriteLine("\n--- Lab 14: Bulk Operations ---");
        var bulkProducts = await context.Products.ToListAsync();
        foreach (var p in bulkProducts)
        {
            p.StockQuantity += 10;
        }
        await context.BulkUpdateAsync(bulkProducts);
        Console.WriteLine("Bulk Update completed successfully!");

        Console.WriteLine("\n--- Lab 15: Concurrency Conflict Detection ---");
        try
        {
            var productSim1 = await context.Products.FirstAsync();

            using var contextSim2 = new AppDbContext();
            var productSim2 = await contextSim2.Products.FirstAsync();
            productSim2.StockQuantity = 999;
            await contextSim2.SaveChangesAsync();

            productSim1.StockQuantity = 111;
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            Console.WriteLine("Concurrency conflict detected.");
        }
    }
}
