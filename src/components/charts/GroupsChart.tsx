import { ProductGroup } from '@/types/product';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface GroupsChartProps {
  groups: ProductGroup[];
  onGroupClick: (groupId: string) => void;
}

export const GroupsChart = ({ groups, onGroupClick }: GroupsChartProps) => {
  const data = groups
    .sort((a, b) => b.percentage - a.percentage)
    .map((g) => ({
      name: g.name,
      id: g.id,
      value: g.percentage,
    }));

  const handleClick = (data: { id: string }) => {
    if (data?.id) {
      onGroupClick(data.id);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-card p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Top Grupos por %</h3>
      </div>
      
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            onClick={(e) => e?.activePayload?.[0]?.payload && handleClick(e.activePayload[0].payload)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis 
              type="number" 
              tickFormatter={(v) => `${v}%`}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={120}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Participação']}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              cursor={{ fill: 'hsl(var(--muted) / 0.5)' }}
            />
            <Bar 
              dataKey="value" 
              radius={[0, 6, 6, 0]}
              cursor="pointer"
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 0 ? 'hsl(var(--primary))' : `hsl(var(--primary) / ${0.9 - index * 0.1})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Clique em uma barra para expandir o grupo
      </p>
    </div>
  );
};
