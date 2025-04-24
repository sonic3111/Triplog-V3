import Script from 'next/script';

export default function Layout({ children }) {
  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`}
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
}
