import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { SimpleSelect } from './SimpleSelect';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, Filter, Eye, CheckCircle, XCircle, QrCode, Plus } from 'lucide-react';
import { QRScanner } from './QRScanner';
import { Textarea } from './ui/textarea';

interface MaintenanceRecord {
  date: string;
  status: 'completed' | 'scheduled' | 'overdue';
  type: string;
}

interface Equipment {
  id: number;
  name: string;
  type: string;
  location: string;
  status: 'working' | 'not-working';
  serialNumber: string;
  manufacturer: string;
  installDate: string;
  operatingHours: number;
  lastMaintenance: string;
  nextMaintenance: string;
  maintenanceHistory: MaintenanceRecord[];
}

const mockEquipment: Equipment[] = [
  {
    id: 1,
    name: 'Насос ЦН-400',
    type: 'Центробежный насос',
    location: 'Цех №3, участок А',
    status: 'working',
    serialNumber: 'ЦН-400-2023-1547',
    manufacturer: 'ООО "Насосмаш"',
    installDate: '2023-03-15',
    operatingHours: 12450,
    lastMaintenance: '2025-10-15',
    nextMaintenance: '2026-01-15',
    maintenanceHistory: [
      { date: '2025-10-15', status: 'completed', type: 'Плановое ТО' },
      { date: '2025-07-10', status: 'completed', type: 'Замена уплотнений' },
      { date: '2025-04-05', status: 'completed', type: 'Плановое ТО' },
    ],
  },
  {
    id: 2,
    name: 'Вентилятор ВР-280',
    type: 'Радиальный вентилятор',
    location: 'Цех №1, участок Б',
    status: 'not-working',
    serialNumber: 'ВР-280-2022-0891',
    manufacturer: 'ЗАО "Вентмаш"',
    installDate: '2022-09-20',
    operatingHours: 18920,
    lastMaintenance: '2025-09-01',
    nextMaintenance: '2025-12-01',
    maintenanceHistory: [
      { date: '2025-12-01', status: 'scheduled', type: 'Плановое ТО' },
      { date: '2025-09-01', status: 'completed', type: 'Замена подшипников' },
      { date: '2025-06-15', status: 'completed', type: 'Плановое ТО' },
    ],
  },
  {
    id: 3,
    name: 'Электродвигатель АИР-315',
    type: 'Асинхронный электродвигатель',
    location: 'Цех №4, участок Г',
    status: 'working',
    serialNumber: 'АИР-315-2024-3421',
    manufacturer: 'ПАО "Электросила"',
    installDate: '2024-02-10',
    operatingHours: 8560,
    lastMaintenance: '2025-11-01',
    nextMaintenance: '2026-02-01',
    maintenanceHistory: [
      { date: '2026-02-01', status: 'scheduled', type: 'Плановое ТО' },
      { date: '2025-11-01', status: 'completed', type: 'Проверка изоляции' },
      { date: '2025-08-15', status: 'completed', type: 'Плановое ТО' },
    ],
  },
  {
    id: 4,
    name: 'Компрессор КВ-500',
    type: 'Винтовой компрессор',
    location: 'Цех №2, участок В',
    status: 'working',
    serialNumber: 'КВ-500-2023-7892',
    manufacturer: 'ООО "Компрессормаш"',
    installDate: '2023-06-12',
    operatingHours: 15230,
    lastMaintenance: '2025-10-20',
    nextMaintenance: '2026-01-20',
    maintenanceHistory: [
      { date: '2026-01-20', status: 'scheduled', type: 'Плановое ТО' },
      { date: '2025-10-20', status: 'completed', type: 'Замена масла' },
      { date: '2025-07-15', status: 'completed', type: 'Плановое ТО' },
    ],
  },
  {
    id: 5,
    name: 'Датчик ТС-100',
    type: 'Датчик температуры',
    location: 'Цех №2, участок В',
    status: 'working',
    serialNumber: 'ТС-100-2024-5612',
    manufacturer: 'ЗАО "Измеритель"',
    installDate: '2024-05-08',
    operatingHours: 7840,
    lastMaintenance: '2025-11-15',
    nextMaintenance: '2026-05-15',
    maintenanceHistory: [
      { date: '2026-05-15', status: 'scheduled', type: 'Калибровка' },
      { date: '2025-11-15', status: 'completed', type: 'Калибровка' },
      { date: '2025-05-15', status: 'completed', type: 'Калибровка' },
    ],
  },
];

export function AssetRegistry() {
  const [equipment, setEquipment] = useState<Equipment[]>(mockEquipment);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isScanning, setIsScanning] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    type: '',
    location: '',
    serialNumber: '',
    manufacturer: '',
    installDate: '',
    operatingHours: 0,
  });

  const uniqueTypes = Array.from(new Set(equipment.map((e) => e.type)));

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleViewEquipment = (item: Equipment) => {
    setSelectedEquipment(item);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'working') {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Работает
        </Badge>
      );
    }
    return (
      <Badge variant="destructive">
        <XCircle className="w-3 h-3 mr-1" />
        Не работает
      </Badge>
    );
  };

  const getMaintenanceStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive', label: string }> = {
      completed: { variant: 'secondary', label: 'Выполнено' },
      scheduled: { variant: 'default', label: 'Запланировано' },
      overdue: { variant: 'destructive', label: 'Просрочено' },
    };
    const config = variants[status] || variants.scheduled;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleQRScan = (data: string) => {
    setIsScanning(false);
    
    try {
      // Парсим данные из QR-кода (предполагаем JSON формат)
      const qrData = JSON.parse(data);
      setNewEquipment({
        name: qrData.name || '',
        type: qrData.type || '',
        location: qrData.location || '',
        serialNumber: qrData.serialNumber || '',
        manufacturer: qrData.manufacturer || '',
        installDate: qrData.installDate || new Date().toISOString().split('T')[0],
        operatingHours: qrData.operatingHours || 0,
      });
      setIsAddDialogOpen(true);
    } catch (error) {
      // Если не JSON, используем данные как серийный номер
      setNewEquipment({
        ...newEquipment,
        serialNumber: data,
      });
      setIsAddDialogOpen(true);
    }
  };

  const handleAddEquipment = () => {
    const equipment: Equipment = {
      id: Math.max(...equipment.map(e => e.id)) + 1,
      ...newEquipment,
      status: 'working',
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      maintenanceHistory: [],
    };
    setEquipment([...equipment, equipment]);
    setIsAddDialogOpen(false);
    setNewEquipment({
      name: '',
      type: '',
      location: '',
      serialNumber: '',
      manufacturer: '',
      installDate: '',
      operatingHours: 0,
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-gray-900 mb-2">Реестр активов</h2>
        <p className="text-gray-600">Управление оборудованием и история технического обслуживания</p>
      </div>

      {isScanning && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <QRScanner 
            onScan={handleQRScan}
            onClose={() => setIsScanning(false)}
          />
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Фильтры и поиск
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={() => setIsScanning(true)} variant="outline">
                <QrCode className="w-4 h-4 mr-2" />
                Сканировать QR
              </Button>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Добавить оборудование
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Поиск</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Название, местоположение, серийный номер..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Тип оборудования</Label>
              <SimpleSelect value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="all">Все типы</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </SimpleSelect>
            </div>
            <div className="space-y-2">
              <Label>Статус</Label>
              <SimpleSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Все статусы</option>
                <option value="working">Работает</option>
                <option value="not-working">Не работает</option>
              </SimpleSelect>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список оборудования ({filteredEquipment.length})</CardTitle>
          <CardDescription>Зарегистрированное оборудование с информацией о техническом состоянии</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Местоположение</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Наработка (ч)</TableHead>
                  <TableHead>Последнее ТО</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>#{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>{item.operatingHours.toLocaleString()}</TableCell>
                    <TableCell>{item.lastMaintenance}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleViewEquipment(item)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Добавление нового оборудования</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eq-name">Название оборудования</Label>
                <Input
                  id="eq-name"
                  placeholder="Например: Насос ЦН-400"
                  value={newEquipment.name}
                  onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eq-type">Тип оборудования</Label>
                <Input
                  id="eq-type"
                  placeholder="Например: Центробежный насос"
                  value={newEquipment.type}
                  onChange={(e) => setNewEquipment({ ...newEquipment, type: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eq-serial">Серийный номер</Label>
                <Input
                  id="eq-serial"
                  placeholder="ЦН-400-2023-1547"
                  value={newEquipment.serialNumber}
                  onChange={(e) => setNewEquipment({ ...newEquipment, serialNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eq-manufacturer">Производитель</Label>
                <Input
                  id="eq-manufacturer"
                  placeholder="Название компании"
                  value={newEquipment.manufacturer}
                  onChange={(e) => setNewEquipment({ ...newEquipment, manufacturer: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eq-location">Местоположение</Label>
                <Input
                  id="eq-location"
                  placeholder="Цех №3, участок А"
                  value={newEquipment.location}
                  onChange={(e) => setNewEquipment({ ...newEquipment, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eq-date">Дата установки</Label>
                <Input
                  id="eq-date"
                  type="date"
                  value={newEquipment.installDate}
                  onChange={(e) => setNewEquipment({ ...newEquipment, installDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="eq-hours">Наработка (часы)</Label>
              <Input
                id="eq-hours"
                type="number"
                placeholder="0"
                value={newEquipment.operatingHours}
                onChange={(e) => setNewEquipment({ ...newEquipment, operatingHours: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleAddEquipment}>Добавить</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Паспорт оборудования</DialogTitle>
          </DialogHeader>
          {selectedEquipment && (
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">Общие данные</TabsTrigger>
                <TabsTrigger value="operation">Эксплуатация</TabsTrigger>
                <TabsTrigger value="maintenance">История ТО</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Основная информация</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Название оборудования</Label>
                      <p className="text-gray-900 mt-1">{selectedEquipment.name}</p>
                    </div>
                    <div>
                      <Label>Тип оборудования</Label>
                      <p className="text-gray-900 mt-1">{selectedEquipment.type}</p>
                    </div>
                    <div>
                      <Label>Серийный номер</Label>
                      <p className="text-gray-900 mt-1">{selectedEquipment.serialNumber}</p>
                    </div>
                    <div>
                      <Label>Производитель</Label>
                      <p className="text-gray-900 mt-1">{selectedEquipment.manufacturer}</p>
                    </div>
                    <div>
                      <Label>Местоположение</Label>
                      <p className="text-gray-900 mt-1">{selectedEquipment.location}</p>
                    </div>
                    <div>
                      <Label>Дата установки</Label>
                      <p className="text-gray-900 mt-1">{selectedEquipment.installDate}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="operation" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Эксплуатационные данные</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Текущий статус</Label>
                        <div className="mt-1">{getStatusBadge(selectedEquipment.status)}</div>
                      </div>
                      <div>
                        <Label>Наработка (часы)</Label>
                        <p className="text-gray-900 mt-1">
                          {selectedEquipment.operatingHours.toLocaleString()} ч
                        </p>
                      </div>
                      <div>
                        <Label>Последнее ТО</Label>
                        <p className="text-gray-900 mt-1">{selectedEquipment.lastMaintenance}</p>
                      </div>
                      <div>
                        <Label>Следующее ТО</Label>
                        <p className="text-gray-900 mt-1">{selectedEquipment.nextMaintenance}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-900">
                        Оборудование находится в эксплуатации{' '}
                        {Math.floor(
                          (new Date().getTime() - new Date(selectedEquipment.installDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{' '}
                        дней
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="maintenance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>История технического обслуживания</CardTitle>
                    <CardDescription>
                      Записи о проведенных и запланированных работах по техническому обслуживанию
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Дата</TableHead>
                          <TableHead>Вид ТО</TableHead>
                          <TableHead>Статус</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedEquipment.maintenanceHistory.map((record, index) => (
                          <TableRow key={index}>
                            <TableCell>{record.date}</TableCell>
                            <TableCell>{record.type}</TableCell>
                            <TableCell>{getMaintenanceStatusBadge(record.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}