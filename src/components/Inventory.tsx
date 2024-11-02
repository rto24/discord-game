import React, { useState, useEffect } from 'react';
import { storeItem } from '@/types/types';
import { useUser } from '@/context/UserContext';
import { CardContainer } from './ui/card';
import Image from 'next/image';
import { Button } from './ui/button';

const InventoryItems = () => {
  const [items, setItems] = useState<storeItem[]>([]);

  const { userId } = useUser();

  useEffect(() => {
    const getInventory = async (userId: number | null) => {
      if (userId === null) return;
      try {
        const response = await fetch(`http://localhost:8080/inventory/${userId}`, {
          headers: { 'Content-Type' : 'application/json' }
        });
        if (!response.ok) {
          throw new Error('Failed to get user inventory');
        }
        const data = await response.json();
        setItems(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
    getInventory(userId);
  }, [userId])

  return (
    <div className="flex flex-col justify-center m-5 px-20 overflow-x-hidden">
    <h1 className="text-5xl font-bold text-zinc-800">INVENTORY</h1>
    <div className="grid gap-x-20 gap-y-1 grid-cols-5 auto-rows-fr">
     {items.map((item, index) => {
          const formattedItemName = item.name.toLowerCase().replace(/\s+/g, "-");
          const imagePath = `/${formattedItemName}.png`;

          const colorMap = {
            "Common": "text-gray-300 shadow-[0_0_30px_10px_rgba(209,213,219,0.7)]", 
            "Rare": "text-blue-400 shadow-[0_0_30px_10px_rgba(96,165,250,0.7)]", 
            "Epic": "text-purple-500 shadow-[0_0_30px_10px_rgba(168,85,247,0.7)]", 
            "Legendary": "text-orange-500 shadow-[0_0_30px_10px_rgba(249,115,22,0.7)]"
          } 
    
          const tierColor = colorMap[item.tier];

          return (
            <CardContainer
              key={index}
              className={`text-white p-4 rounded-lg bg-zinc-900 flex flex-col items-center h-full w-full transition-all duration-300 ${tierColor} hover:shadow-lg hover:${colorMap[item.tier].split(' ')[1]}`}
              containerClassName="w-[350px] h-[600px]"
            >
              <div className="flex flex-col items-center justify-center mb-4">
                <Image 
                  src={imagePath}
                  alt={item.name}
                  width={200}
                  height={200}
                />
                <h3 className="text-lg font-semibold text-white">
                  {item.name}
                </h3>
                <h3 className={`font-semibold ${tierColor.split(' ')[0]} text-center`}>{item.tier}</h3>
                <p className="text-base font-semibold">Price: ${item.price}</p>
                <p className="text-sm text-gray-400 text-center mb-5 mt-3">{item.description}</p>
                <Button
                  className="outline outline-1"
                >
                  Purchase
                </Button>
              </div>
            </CardContainer>
          )
        })}
    </div>
    </div>
  )
}

export default InventoryItems;