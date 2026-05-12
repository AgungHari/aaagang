import Script from 'next/script';

export default function ProfitableAdUnit() {
  return (
    <div className="mb-6">
      <Script
        src="https://pl29430814.profitablecpmratenetwork.com/e97d6d24afaac0dbeeb7316082503a41/invoke.js"
        async
        data-cfasync="false"
        strategy="afterInteractive"
      />
      <div
        id="container-e97d6d24afaac0dbeeb7316082503a41"
        className="min-h-[90px] w-full"
      />
    </div>
  );
}
