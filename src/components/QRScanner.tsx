import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { X, Camera, Keyboard } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [manualInput, setManualInput] = useState('');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScan(manualInput.trim());
    }
  };

  const handleQuickAdd = (type: string) => {
    const mockData = {
      'pump': JSON.stringify({
        name: 'Насос ЦН-500',
        type: 'Центробежный насос',
        location: 'Цех №5, участок А',
        serialNumber: `ЦН-500-2025-${Math.floor(Math.random() * 9000) + 1000}`,
        manufacturer: 'ООО "Насосмаш"',
        installDate: new Date().toISOString().split('T')[0],
        operatingHours: 0,
      }),
      'motor': JSON.stringify({
        name: 'Электродвигатель АИР-400',
        type: 'Асинхронный электродвигатель',
        location: 'Цех №6, участок Б',
        serialNumber: `АИР-400-2025-${Math.floor(Math.random() * 9000) + 1000}`,
        manufacturer: 'ПАО "Электросила"',
        installDate: new Date().toISOString().split('T')[0],
        operatingHours: 0,
      }),
      'compressor': JSON.stringify({
        name: 'Компрессор КВ-600',
        type: 'Винтовой компрессор',
        location: 'Цех №7, участок В',
        serialNumber: `КВ-600-2025-${Math.floor(Math.random() * 9000) + 1000}`,
        manufacturer: 'ООО "Компрессормаш"',
        installDate: new Date().toISOString().split('T')[0],
        operatingHours: 0,
      }),
    };
    onScan(mockData[type as keyof typeof mockData]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Добавление оборудования по QR-коду
            </CardTitle>
            <CardDescription>
              Введите данные вручную или выберите шаблон
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">
              <Keyboard className="w-4 h-4 mr-2" />
              Ручной ввод
            </TabsTrigger>
            <TabsTrigger value="templates">
              <Camera className="w-4 h-4 mr-2" />
              Шаблоны
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4">
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="manual-input">
                  Данные QR-кода или серийный номер
                </Label>
                <Input
                  id="manual-input"
                  placeholder="Введите данные из QR-кода или серийный номер оборудования"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Совет:</strong> Вы можете ввести как JSON-данные с полной информацией об оборудовании, 
                  так и просто серийный номер. При вводе серийного номера остальные поля нужно будет заполнить вручную.
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onClose}>
                  Отмена
                </Button>
                <Button type="submit" disabled={!manualInput.trim()}>
                  Продолжить
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="space-y-2">
              <Label>Быстрое добавление оборудования</Label>
              <p className="text-sm text-gray-600">
                Выберите тип оборудования для добавления с предзаполненными данными
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleQuickAdd('pump')}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-gray-900">Центробежный насос</h4>
                      <p className="text-sm text-gray-600">Насос ЦН-500</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleQuickAdd('motor')}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-gray-900">Асинхронный электродвигатель</h4>
                      <p className="text-sm text-gray-600">Электродвигатель АИР-400</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleQuickAdd('compressor')}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-gray-900">Винтовой компрессор</h4>
                      <p className="text-sm text-gray-600">Компрессор КВ-600</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Примечание:</strong> После выбора шаблона откроется форма с предзаполненными данными, 
                которые вы сможете отредактировать перед добавлением оборудования в реестр.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
