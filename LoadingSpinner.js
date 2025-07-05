function LoadingSpinner({ size = 'md' }) {
    try {
        const sizeClasses = {
            sm: 'w-4 h-4',
            md: 'w-8 h-8',
            lg: 'w-12 h-12'
        };

        return (
            <div data-name="loading-spinner" data-file="components/LoadingSpinner.js" 
                 className="flex justify-center items-center">
                <div className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
            </div>
        );
    } catch (error) {
        console.error('LoadingSpinner error:', error);
        reportError(error);
        return <div>Loading...</div>;
    }
}
