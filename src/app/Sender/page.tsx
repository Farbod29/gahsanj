import Link from 'next/link';

const Sender = () => {
  return (
    <section>
      <h1>Sender to server side Receiver </h1>
      <Link
        href={{
          pathname: '/Receiver',
          query: {
            search: 'AAAA server',
          },
        }}
      >
        Go to another page
      </Link>

      <h1>Sender to client side Receiver </h1>
      <Link
        href={{
          pathname: '/ReceiverClient',
          query: {
            search: 'BBBB client',
          },
        }}
      >
        Go to another page
      </Link>
    </section>
  );
};

export default Sender;
