"use client";

import ProductCard from "@/components/product-card.view";
import { urlHandler } from "@/utils/utils";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import NewProductDialog from "@/components/new-product-dialog.view";
import { ProductType } from "@/components/types/product.api";

export default function Products() {
    const [products, setProducts] = React.useState<ProductType[]>([
        {
            id: "1",
            subparts: [
                {
                    id: "1",
                    manufacturer: {
                        id: 2,
                        name: "Greenergy Oy",
                    },
                    name: "Green Electricity",
                    co2_footprint: 2,
                    quantity_needed_per_unit: 2,
                    units_bought: 200,
                    number_of_units: 300,
                    productURL: "",
                },
            ],
            manufacturer: {
                id: 1,
                name: "Miningful Oyj",
            },
            name: "Steel",
            number_of_units: 100,
            co2_footprint: 20,
        },
    ]);

    const fetchData = React.useCallback(() => {
        if (typeof window !== "undefined") {
            const origin = window.location.origin;
            fetch(`${urlHandler(origin)}/api/products/`)
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data)) setProducts(data);
                });
        }
    }, [setProducts]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="flex gap-4 flex-col">
            <div className="w-full">
                <div className="flex justify-end pt-4">
                    <NewProductDialog onCreateProduct={fetchData} />
                </div>
            </div>
            <p className="text-xl font-bold dark:text-white">
                Current products
            </p>
            <div className="flex gap-8 flex-wrap">
                {!!products ? (
                    products.map((item, index) => {
                        return (
                            <ProductCard
                                key={index}
                                title={item.name}
                                description="to be described"
                                numberOfUnits={item.number_of_units}
                                co2PerUnit={item.co2_footprint}
                                id={Number(item.id)}
                                subparts={item.subparts}
                            />
                        );
                    })
                ) : (
                    <ProductCard
                        title={<Skeleton className="h-4 w-[250px]" />}
                        description={
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        }
                        id={0}
                    />
                )}
            </div>
        </div>
    );
}
