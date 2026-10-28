'use client'
import { getCategories } from '@/lib/api/category'
import { categoryIcons } from '@/lib/constants/categoryIcons';
import { CategoryCircularCard } from '@/types/types';
import { useEffect, useState } from 'react'
import CategoryCard from './CategoryCard';
import { Grip } from 'lucide-react';

const CategorySection = () => {
  const [categoryData, setCategoryData] = useState<CategoryCircularCard[] | null>(null);

  const shuffleArray = <T,>(array: T[]) => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      const res = await getCategories();

      if (!res || !isMounted) {
        return;
      }

      const shuffledCategories = shuffleArray(res.data);
      const categoryWithIcon = shuffledCategories.map((item) => ({
        ...item,
        icon: categoryIcons[item.slug as keyof typeof categoryIcons],
      }));

      setCategoryData(categoryWithIcon.slice(0, 7));
    };

    void loadCategories();

    return () => {
      isMounted = false;
    };
  }, [])
  
  return (
     <section
          aria-labelledby="categories-heading"
          className="bg-[#FAF8F5] py-16 sm:py-20"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h2
              id="categories-heading"
              className="mb-10 text-center font-serif text-3xl font-normal text-[#17181A] sm:mb-12 sm:text-4xl"
            >
              Shop By Categories
            </h2>
    
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-8">
              {categoryData && categoryData.map((item) => (
                <CategoryCard url={`/shop?category=${item.slug}`} key={item.id} icon={item.icon} name={item.name} slug={item.slug} id={item.id} />
              ))}
              <CategoryCard url="/categories" key={'view_all'} icon={Grip} name={"View All"} slug={''} id={999} />
            </div>
          </div>
        </section>
  )
}

export default CategorySection