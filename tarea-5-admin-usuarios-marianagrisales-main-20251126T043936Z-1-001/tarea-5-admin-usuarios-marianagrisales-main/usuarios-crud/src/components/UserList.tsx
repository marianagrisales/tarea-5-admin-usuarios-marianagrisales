import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser } from '../features/users/usersSlice';
import type { RootState, AppDispatch } from '../app/store';
import { Link } from 'react-router-dom';

const UserList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, status, error } = useSelector((s: RootState) => s.users);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchUsers());
  }, [dispatch, status]);

  const handleDelete = (id: number) => {
    if (!confirm('¿Eliminar usuario?')) return;
    dispatch(deleteUser(id));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Lista de Usuarios</h2>

      {status === 'loading' && <p>Cargando usuarios...</p>}
      {status === 'failed' && <p className="text-red-600">Error: {error}</p>}

      <div className="space-y-3">
        {list.map(u => (
          <div key={u.id} className="p-3 border rounded flex justify-between items-center">
            <div>
              <div className="font-medium">{u.name} <span className="text-sm text-gray-500">(@{u.username})</span></div>
              <div className="text-sm text-gray-600">{u.email} • {u.phone}</div>
            </div>
            <div className="flex gap-2">
              <Link to={`/edit/${u.id}`} className="px-3 py-1 bg-yellow-400 rounded">Editar</Link>
              <button onClick={() => handleDelete(u.id)} className="px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;