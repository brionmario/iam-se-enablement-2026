import Header from '../components/Header';

export default function MainLayout({ children, signIn }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
