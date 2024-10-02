const SnippetLayout = (
    {children}: {children: React.ReactNode}
) => {
    return ( 
        <div className="h-[calc(100vh-6rem)]">
            {children}
        </div>
     );
}
 
export default SnippetLayout;