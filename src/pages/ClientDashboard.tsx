
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { MenuItemCard } from '@/components/MenuItemCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCafe } from '@/context/CafeContext';
import { Search } from 'lucide-react';

const ClientDashboard: React.FC = () => {
  const { menuItems } = useCafe();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get unique categories from menu items
  const categories = Array.from(
    new Set(menuItems.map(item => item.category))
  );
  
  // Filter menu items based on search query
  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto p-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">College Cafeteria</h1>
          <p className="text-muted-foreground">
            Browse our menu and place your order for quick pickup
          </p>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search for food items, categories..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mb-4 overflow-x-auto flex flex-nowrap max-w-full no-scrollbar">
            <TabsTrigger value="all">All Items</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <MenuItemCard key={item.id} item={item} />
              ))}
              
              {filteredItems.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No items found matching your search.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {categories.map(category => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredItems
                  .filter(item => item.category === category)
                  .map(item => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                
                {filteredItems.filter(item => item.category === category).length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No items found in this category.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default ClientDashboard;
