import { Link } from "react-router-dom";

export default function Card(props) {
  const apiHost = import.meta.env.VITE_APP_HOST;
  const imageUrl = `${apiHost}/api/images/${props.product.filename}`; 

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex align-items-center position-relative">

          <Link to={`/details/${props.product.id}`}>
            <img 
              src={imageUrl} 
              alt={props.product.name} 
              style={{ 
                width: '100px', 
                height: 'auto', 
                objectFit: 'cover' 
              }} 
            />
          </Link>

          <div className="product-info">
            <h5 className="card-title">{props.product.name}</h5>
            <p className="card-text">
              <strong>Price: ${props.product.cost}</strong>
            </p>
          </div>

          {props.showLinks && (
            <div className="position-absolute top-0 end-0">
              <Link to={`/update/${props.product.id}`} className="btn btn-light">
                <i className="bi bi-pencil-square"></i>
              </Link>{" "}
              &nbsp;
              <Link to={`/delete/${props.product.id}`} className="btn btn-light">
                <i className="bi bi-trash"></i>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}