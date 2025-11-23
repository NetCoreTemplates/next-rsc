using System.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using MyApp.Data;
using ServiceStack;
using ServiceStack.DataAnnotations;
using ServiceStack.OrmLite;

namespace MyApp.Migrations;

public class Migration1000 : MigrationBase
{
    public class Booking : AuditBase
    {
        [AutoIncrement]
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public RoomType RoomType { get; set; }
        public int RoomNumber { get; set; }
        public DateTime BookingStartDate { get; set; }
        public DateTime? BookingEndDate { get; set; }
        public decimal Cost { get; set; }
        public string? Notes { get; set; }
        public bool? Cancelled { get; set; }
    }

    public enum RoomType
    {
        Queen,
        Double,
        Suite,
    }

    public override void Up()
    {
        Db.CreateTable<Booking>();
        CreateBooking(Db, "First Booking!", RoomType.Queen, 10, 100, "employee@email.com");
        CreateBooking(Db, "Booking 2", RoomType.Double, 12, 120, "manager@email.com");
        CreateBooking(Db, "Booking the 3rd", RoomType.Suite, 13, 130, "employee@email.com");
    }

    public void CreateBooking(IDbConnection? db,
        string name, RoomType type, int roomNo, decimal cost, string by) =>
        db.Insert(new Booking
        {
            Name = name,
            RoomType = type,
            RoomNumber = roomNo,
            Cost = cost,
            BookingStartDate = DateTime.UtcNow.AddDays(roomNo),
            BookingEndDate = DateTime.UtcNow.AddDays(roomNo + 7),
            CreatedBy = by,
            CreatedDate = DateTime.UtcNow,
            ModifiedBy = by,
            ModifiedDate = DateTime.UtcNow,
        });

    public override void Down()
    {
        Db.DropTable<Booking>();
    }
}