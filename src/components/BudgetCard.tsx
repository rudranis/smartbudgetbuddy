
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: "weekly" | "monthly" | "yearly";
  color?: string;
}

interface BudgetCardProps {
  budget: Budget;
  onClick?: () => void;
  className?: string;
}

const BudgetCard = ({ budget, onClick, className }: BudgetCardProps) => {
  const [progress, setProgress] = useState(0);
  const percentage = (budget.spent / budget.amount) * 100;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(budget.amount);

  const formattedSpent = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(budget.spent);

  const remaining = budget.amount - budget.spent;
  const formattedRemaining = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(remaining);

  const isOverBudget = budget.spent > budget.amount;
  const isCloseToLimit = percentage >= 80 && percentage < 100;

  return (
    <div 
      className={cn(
        "p-4 rounded-xl border bg-white shadow-subtle card-transition animate-fade-in",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{budget.category}</h3>
        <span className="text-sm text-muted-foreground capitalize">{budget.period}</span>
      </div>
      
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-2xl font-bold">{formattedSpent}</span>
        <span className="text-muted-foreground">of {formattedAmount}</span>
      </div>
      
      <Progress 
        value={progress > 100 ? 100 : progress} 
        className={cn(
          "h-2 mb-2",
          isOverBudget ? "bg-red-100" : isCloseToLimit ? "bg-amber-100" : "bg-blue-100"
        )} 
        indicatorClassName={cn(
          isOverBudget ? "bg-red-500" : isCloseToLimit ? "bg-amber-500" : "bg-blue-500"
        )}
      />
      
      <div className="flex items-center justify-between mt-2">
        {isOverBudget ? (
          <div className="flex items-center text-red-500 text-sm font-medium">
            <AlertTriangle className="w-4 h-4 mr-1" />
            <span>Over by {formattedRemaining.replace('-', '')}</span>
          </div>
        ) : (
          <span className={cn(
            "text-sm font-medium",
            isCloseToLimit ? "text-amber-500" : "text-green-500"
          )}>
            {formattedRemaining} left
          </span>
        )}
        <span className="text-sm font-medium">
          {percentage.toFixed(0)}%
        </span>
      </div>
    </div>
  );
};

export default BudgetCard;
