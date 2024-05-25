import { cn } from '../../utils/utils';

function Skeleton({ className, ...props }) {
  return <div className={cn('bg-primary/10 animate-pulse rounded-md', className)} {...props} />;
}

export default Skeleton;
