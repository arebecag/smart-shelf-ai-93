import { useState, useEffect, useRef } from 'react';
import { ProductGroup, FilterState } from '@/types/product';
import { ProductCard } from './ProductCard';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GroupAccordionProps {
  groups: ProductGroup[];
  filters: FilterState;
  expandedGroupId: string | null;
  onGroupToggle: (groupId: string) => void;
}

export const GroupAccordion = ({ groups, filters, expandedGroupId, onGroupToggle }: GroupAccordionProps) => {
  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <GroupItem
          key={group.id}
          group={group}
          filters={filters}
          isExpanded={expandedGroupId === group.id}
          onToggle={() => onGroupToggle(group.id)}
        />
      ))}
    </div>
  );
};

interface GroupItemProps {
  group: ProductGroup;
  filters: FilterState;
  isExpanded: boolean;
  onToggle: () => void;
}

const GroupItem = ({ group, filters, isExpanded, onToggle }: GroupItemProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded, group.products.length]);

  // Re-calculate height when products might have expanded content
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (contentRef.current && isExpanded) {
        setHeight(contentRef.current.scrollHeight);
      }
    });

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [isExpanded]);

  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors text-left"
      >
        <ChevronRight 
          className={cn(
            "w-5 h-5 text-muted-foreground transition-transform duration-200",
            isExpanded && "rotate-90"
          )} 
        />
        
        <div className="flex-1 flex items-center gap-3">
          <Package className="w-5 h-5 text-primary" />
          <span className="font-semibold text-foreground">{group.name}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-primary/10 text-primary font-semibold">
            {group.percentage.toFixed(1)}%
          </Badge>
          <span className="text-sm text-muted-foreground">
            {group.products.length > 0 ? `${group.products.length} produtos` : '—'}
          </span>
        </div>
      </button>

      {/* Content */}
      <div 
        style={{ maxHeight: height }}
        className="transition-all duration-300 ease-out overflow-hidden"
      >
        <div ref={contentRef} className="p-4 pt-0 border-t border-border">
          {group.products.length > 0 ? (
            <div className="flex flex-wrap gap-4 pt-4">
              {group.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  filters={filters}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>Nenhum produto neste grupo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
