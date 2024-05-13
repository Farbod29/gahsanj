import Link from 'next/link';

const SomePage = () => {
  return (
    <section>
      <h1>Sender to server side Receiver </h1>
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

      <h1>Sender to server side Receiver </h1>
      <Link
        href={{
          pathname: '/ReceiverClient',
          query: {
            search: 'Sosis bandari22',
          },
        }}
      >
        Go to another page
      </Link>
    </section>
  );
};

export default SomePage;
