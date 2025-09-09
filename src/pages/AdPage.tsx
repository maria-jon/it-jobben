import { useParams } from "react-router-dom";

export default function AdPage() {
  const { id } = useParams();
  return <h1>Ad Page {id}</h1>;
}
