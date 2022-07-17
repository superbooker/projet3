// == Import
import PropTypesLib from 'prop-types';

// == Composant
function Events({ addresses }) {
  return (
    <table>
      <tbody>
        {addresses.map((item) => {
            return (
              <tr key={item.id}>
                <td>{item.returnValues.addr}</td>
              </tr>
            );
          }
        )}
      </tbody>
    </table>
  );
};

// Vérification du type des props
Events.propTypes = {
  addresses: PropTypesLib.array.isRequired,
};

// == Export
export default Events;
