import Link from 'next/link';

const SomePage = () => {
  return (
    <section>
      <h1>Some page</h1>
      <Link
        href={{
          pathname: '/Receiver',
          query: {
            search: 'search',
          },
        }}
      >
        Go to another page
      </Link>

      <h1>Some page client </h1>
      <Link
        href={{
          pathname: '/ReceiverClient',
          query: {
            search: 'Sosis bandari',
          },
        }}
      >
        Go to another page
      </Link>
    </section>
  );
};

export default SomePage;
