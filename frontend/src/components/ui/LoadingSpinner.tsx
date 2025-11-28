interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({
  message = "Loading...",
}: LoadingSpinnerProps) => {
  return <div className="text-center py-8 text-gray-600">{message}</div>;
};
