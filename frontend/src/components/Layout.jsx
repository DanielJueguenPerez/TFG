import Header from './Header';

export default function Layout ({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
        </div>
    );
}