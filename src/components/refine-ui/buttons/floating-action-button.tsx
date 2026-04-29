import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export const FloatingActionButton = () => {
    const navigate = useNavigate();

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <Button
                onClick={() => navigate("/ventas/create")}
                className="h-14 w-14 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center p-0"
                title="Nueva Venta"
            >
                <Plus className="h-8 w-8" />
            </Button>
        </div>
    );
};
