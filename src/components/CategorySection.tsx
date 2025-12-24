import { Link } from 'react-router-dom';
import { categories } from '@/lib/data';

export function CategorySection() {
  return (
    <section className="py-12 border-t border-border/30">
      <h2 className="font-heading text-2xl text-foreground mb-6 text-center">
        Browse by Category
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/profiles?category=${category.id}`}
            className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">
              {category.icon}
            </span>
            <span className="text-sm font-medium text-foreground">{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
