import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  CheckCircle, 
  X, 
  QrCode, 
  Building, 
  Calendar, 
  Hash, 
  Tag,
  Clock,
  Factory
} from 'lucide-react';

interface EquipmentData {
  name: string;
  type: string;
  location: string;
  serialNumber: string;
  manufacturer: string;
  installDate: string;
  operatingHours: number;
}

interface EquipmentInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentData: EquipmentData;
}

export function EquipmentInfoDialog({ 
  isOpen, 
  onClose, 
  equipmentData
}: EquipmentInfoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Информация об оборудовании
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Success Badge */}
          <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-green-900">
              QR-код успешно считан! Информация об оборудовании отображается ниже.
            </p>
          </div>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">Основная информация</TabsTrigger>
              <TabsTrigger value="details">Детали</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Общие данные
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-500" />
                      Название оборудования
                    </Label>
                    <p className="text-gray-900 p-2 bg-gray-50 rounded-md border border-gray-200">
                      {equipmentData.name || <span className="text-gray-400">Не указано</span>}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      Тип оборудования
                    </Label>
                    <p className="text-gray-900 p-2 bg-gray-50 rounded-md border border-gray-200">
                      {equipmentData.type || <span className="text-gray-400">Не указано</span>}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-500" />
                      Серийный номер
                    </Label>
                    <p className="text-gray-900 p-2 bg-gray-50 rounded-md border border-gray-200 font-mono">
                      {equipmentData.serialNumber || <span className="text-gray-400 font-sans">Не указано</span>}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Factory className="w-4 h-4 text-gray-500" />
                      Производитель
                    </Label>
                    <p className="text-gray-900 p-2 bg-gray-50 rounded-md border border-gray-200">
                      {equipmentData.manufacturer || <span className="text-gray-400">Не указано</span>}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Расположение и параметры
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      Местоположение
                    </Label>
                    <p className="text-gray-900 p-2 bg-gray-50 rounded-md border border-gray-200">
                      {equipmentData.location || <span className="text-gray-400">Не указано</span>}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      Дата установки
                    </Label>
                    <p className="text-gray-900 p-2 bg-gray-50 rounded-md border border-gray-200">
                      {equipmentData.installDate || <span className="text-gray-400">Не указано</span>}
                    </p>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      Наработка (часы)
                    </Label>
                    <p className="text-gray-900 p-2 bg-gray-50 rounded-md border border-gray-200">
                      {equipmentData.operatingHours.toLocaleString()} часов
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info Card */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-blue-900">
                      <CheckCircle className="w-4 h-4" />
                      <span>Информация считана из QR-кода</span>
                    </p>
                    <p className="flex items-center gap-2 text-blue-900">
                      <Calendar className="w-4 h-4" />
                      <span>Дата сканирования: {new Date().toLocaleDateString('ru-RU')}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button onClick={onClose}>
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}