import { useState } from "react";
import { ComplaintForm } from "./components/ComplaintForm";
import { AdminPanel } from "./components/AdminPanel";
import { AssetRegistry } from "./components/AssetRegistry";
import { MaintenancePlanning } from "./components/MaintenancePlanning";
import { Button } from "./components/ui/button";
import {
  ClipboardList,
  LayoutDashboard,
  Database,
  Calendar,
} from "lucide-react";

type Page = "complaints" | "admin" | "assets" | "planning";

export default function App() {
  const [currentPage, setCurrentPage] =
    useState<Page>("complaints");

  const navigation = [
    {
      id: "complaints" as Page,
      label: "Прием жалоб",
      icon: ClipboardList,
    },
    {
      id: "admin" as Page,
      label: "Панель администратора",
      icon: LayoutDashboard,
    },
    {
      id: "assets" as Page,
      label: "Реестр активов",
      icon: Database,
    },
    {
      id: "planning" as Page,
      label: "Планирование ТО",
      icon: Calendar,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">Система ТО</h1>
                <p className="text-sm text-gray-500">
                  Техническое обслуживание
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <nav className="flex gap-2 mb-6 bg-white p-2 rounded-lg border border-gray-200">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={
                  currentPage === item.id ? "default" : "ghost"
                }
                onClick={() => setCurrentPage(item.id)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        {/* Page Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {currentPage === "complaints" && <ComplaintForm />}
          {currentPage === "admin" && <AdminPanel />}
          {currentPage === "assets" && <AssetRegistry />}
          {currentPage === "planning" && (
            <MaintenancePlanning />
          )}
        </div>
      </div>
    </div>
  );
}