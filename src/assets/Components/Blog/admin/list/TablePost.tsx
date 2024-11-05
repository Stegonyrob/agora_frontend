import PostList from './PostList';

const Table = ({ posts, acctions }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Fecha de creación</th>
                    <th>Título</th>
                    <th>Primer oración</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <PostList posts={posts} acciones={acctions} />
            </tbody>
        </table>
    );
};

export default Table;