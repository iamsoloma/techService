import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { SimpleSelect } from './SimpleSelect';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Plus, Search, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface Task {
  id: number;
  title: string;
  equipment: string;
  location: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'in-progress' | 'completed' | 'cancelled';
  assignee: string;
  date: string;
  description: string;
}

const mockTasks: Task[] = [
  {
    id: 1001,
    title: 'Замена масла в насосе ЦН-400',
    equipment: 'Насос ЦН-400',
    location: 'Цех №3, участок А',
    priority: 'high',
    status: 'in-progress',
    assignee: 'Бригада №1',
    date: '2025-11-22',
    description: 'Плановая замена масла согласно регламенту ТО',
  },
  {
    id: 1002,
    title: 'Ремонт вентиляционной системы',
    equipment: 'Вентилятор ВР-280',
    location: 'Цех №1, участок Б',
    priority: 'critical',
    status: 'new',
    assignee: 'Не назначено',
    date: '2025-11-22',
    description: 'Аварийная остановка, требуется немедленный ремонт',
  },
  {
    id: 1003,
    title: 'Калибровка датчиков температуры',
    equipment: 'Датчик ТС-100',
    location: 'Цех №2, участок В',
    priority: 'medium',
    status: 'completed',
    assignee: 'Бригада №2',
    date: '2025-11-21',
    description: 'Плановая калибровка измерительных приборов',
  },
  {
    id: 1004,
    title: 'Проверка электродвигателя',
    equipment: 'Электродвигатель АИР-315',
    location: 'Цех №4, участок Г',
    priority: 'low',
    status: 'new',
    assignee: 'Не назначено',
    date: '2025-11-23',
    description: 'Профилактическая проверка перед запуском',
  },
];

export function AdminPanel() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    equipment: '',
    location: '',
    priority: 'medium' as const,
    assignee: '',
    description: '',
  });

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      low: { variant: 'secondary', label: 'Низкий' },
      medium: { variant: 'default', label: 'Средний' },
      high: { variant: 'default', label: 'Высокий' },
      critical: { variant: 'destructive', label: 'Критический' },
    };
    const config = variants[priority] || variants.medium;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'outline', label: string }> = {
      new: { variant: 'outline', label: 'Новая' },
      'in-progress': { variant: 'default', label: 'В работе' },
      completed: { variant: 'secondary', label: 'Завершена' },
      cancelled: { variant: 'outline', label: 'Отменена' },
    };
    const config = variants[status] || variants.new;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleAddTask = () => {
    const task: Task = {
      id: Math.max(...tasks.map(t => t.id)) + 1,
      ...newTask,
      status: 'new',
      date: new Date().toISOString().split('T')[0],
    };
    setTasks([task, ...tasks]);
    setIsAddDialogOpen(false);
    setNewTask({
      title: '',
      equipment: '',
      location: '',
      priority: 'medium',
      assignee: '',
      description: '',
    });
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.equipment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 mb-2">Панель администратора</h2>
          <p className="text-gray-600">Управление задачами технического обслуживания</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Добавить задачу
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Создание новой задачи</DialogTitle>
              <DialogDescription>
                Заполните информацию о новой задаче технического обслуживания
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Название задачи</Label>
                <Input
                  id="task-title"
                  placeholder="Например: Замена фильтров"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="task-equipment">Оборудование</Label>
                  <Input
                    id="task-equipment"
                    placeholder="Название оборудования"
                    value={newTask.equipment}
                    onChange={(e) => setNewTask({ ...newTask, equipment: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-location">Местоположение</Label>
                  <Input
                    id="task-location"
                    placeholder="Цех, участок"
                    value={newTask.location}
                    onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="task-priority">Приоритет</Label>
                  <SimpleSelect
                    id="task-priority"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                  >
                    <option value="low">Низкий</option>
                    <option value="medium">Средний</option>
                    <option value="high">Высокий</option>
                    <option value="critical">Критический</option>
                  </SimpleSelect>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-assignee">Исполнитель</Label>
                  <Input
                    id="task-assignee"
                    placeholder="Бригада или сотрудник"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-description">Описание</Label>
                <Textarea
                  id="task-description"
                  placeholder="Детальное описание задачи"
                  rows={4}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={handleAddTask}>Создать задачу</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Поиск задач</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Поиск по названию, оборудованию или местоположению..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список задач ({filteredTasks.length})</CardTitle>
          <CardDescription>Все зарегистрированные задачи технического обслуживания</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Оборудование</TableHead>
                  <TableHead>Местоположение</TableHead>
                  <TableHead>Приоритет</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Исполнитель</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>#{task.id}</TableCell>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.equipment}</TableCell>
                    <TableCell>{task.location}</TableCell>
                    <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                    <TableCell>{getStatusBadge(task.status)}</TableCell>
                    <TableCell>{task.assignee}</TableCell>
                    <TableCell>{task.date}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTask(task);
                          setIsViewDialogOpen(true);
                        }}
                      >
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

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Детали задачи #{selectedTask?.id}</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div>
                <Label>Название</Label>
                <p className="text-gray-900 mt-1">{selectedTask.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Оборудование</Label>
                  <p className="text-gray-900 mt-1">{selectedTask.equipment}</p>
                </div>
                <div>
                  <Label>Местоположение</Label>
                  <p className="text-gray-900 mt-1">{selectedTask.location}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Приоритет</Label>
                  <div className="mt-1">{getPriorityBadge(selectedTask.priority)}</div>
                </div>
                <div>
                  <Label>Статус</Label>
                  <div className="mt-1">{getStatusBadge(selectedTask.status)}</div>
                </div>
                <div>
                  <Label>Дата</Label>
                  <p className="text-gray-900 mt-1">{selectedTask.date}</p>
                </div>
              </div>
              <div>
                <Label>Исполнитель</Label>
                <p className="text-gray-900 mt-1">{selectedTask.assignee}</p>
              </div>
              <div>
                <Label>Описание</Label>
                <p className="text-gray-700 mt-1">{selectedTask.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}