import { useAppSelector } from '../../../application/Redux/store/store';

const ListSample = () => {
  const persons = useAppSelector((state) => state.person.persons);
  // const {persons} = useAppSelector((state) => state.person);

  return (
    <div>
      <p className="bg-red-500">This is List Component</p>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {persons.map((person) => (
            <tr key={person.id}>
              <td className="p-2">{person.id}</td>
              <td className="p-2">{person.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListSample;
