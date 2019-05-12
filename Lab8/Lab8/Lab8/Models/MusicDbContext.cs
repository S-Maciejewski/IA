using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace Lab8.Models
{
    public class MusicDbContext : DbContext
    {
        public DbSet<Song> Songs { get; set; }

        public System.Data.Entity.DbSet<Lab8.Models.Genre> Genres { get; set; }
    }
}