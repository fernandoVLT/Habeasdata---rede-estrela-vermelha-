import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, Calendar, MapPin, TrendingUp } from 'lucide-react';

const engagementData = [
  { name: 'Jan', participacoes: 400, novosFiliados: 240 },
  { name: 'Fev', participacoes: 300, novosFiliados: 139 },
  { name: 'Mar', participacoes: 200, novosFiliados: 980 },
  { name: 'Abr', participacoes: 278, novosFiliados: 390 },
  { name: 'Mai', participacoes: 189, novosFiliados: 480 },
  { name: 'Jun', participacoes: 239, novosFiliados: 380 },
];

const regionData = [
  { name: 'Belo Horizonte', value: 400 },
  { name: 'Contagem', value: 300 },
  { name: 'Uberlândia', value: 300 },
  { name: 'Juiz de Fora', value: 200 },
];

const COLORS = ['#dc2626', '#ef4444', '#f87171', '#fca5a5'];

export const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="sticky top-0 bg-white/85 backdrop-blur-md z-10 border-b border-gray-200 px-4 py-3">
        <h2 className="text-xl font-bold text-gray-900">Métricas de Engajamento</h2>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto pb-24 flex-1">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-red-100 p-3 rounded-full text-red-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Militantes Ativos</p>
              <p className="text-2xl font-bold text-gray-900">12.4k</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-red-100 p-3 rounded-full text-red-600">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Eventos Realizados</p>
              <p className="text-2xl font-bold text-gray-900">342</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-red-100 p-3 rounded-full text-red-600">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Cidades Alcançadas</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-red-100 p-3 rounded-full text-red-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Crescimento (Mês)</p>
              <p className="text-2xl font-bold text-gray-900">+15%</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Evolução do Engajamento</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="participacoes" name="Participações em Eventos" stroke="#dc2626" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="novosFiliados" name="Novos Filiados" stroke="#f87171" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Distribuição por Região (MG)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Atividade Mensal</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Bar dataKey="participacoes" name="Participações" fill="#dc2626" radius={[4, 4, 0, 0]} />
                <Bar dataKey="novosFiliados" name="Novos Filiados" fill="#fca5a5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
