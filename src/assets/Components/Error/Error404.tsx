const Error404 = () => {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1 style={{ fontSize: '48px', color: '#ff0000' }}>¡Error 404!</h1>
            <p style={{ fontSize: '24px', color: '#ff0000' }}>Lo sentimos, la página que buscas no existe.</p>
            <img
                src="https://media.giphy.com/media/3o7buirY5U8r5V3a9i/giphy.gif"
                alt="Error 404 GIF"
                style={{ maxWidth: '100%', height: 'auto' }}
            />
            <br />
            <a href="/" style={{ fontSize: '20px', color: '#007bff', textDecoration: 'none' }}>
                Volver a la página principal
            </a>
        </div>
    );
};

export default Error404;
