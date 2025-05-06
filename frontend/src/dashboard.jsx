import axios from 'axios';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis, YAxis
} from 'recharts';

function Dashboard({ token }) {
  const [file, setFile] = useState(null);
  const [csvPreview, setCsvPreview] = useState('');
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      setError('Aucun fichier sélectionné');
      return;
    }
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        setCsvPreview(reader.result.split('\n').slice(0, 5).join('\n'));

        const formData = new FormData();
        formData.append('file', file);

        const res = await axios.post('http://localhost:8000/upload', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
        setError(null);
      };
      reader.readAsText(file);
    } catch (err) {
      setError("Erreur lors de l'upload");
    }
  };

  const renderBarData = (stat) =>
    stat ? Object.entries(stat).map(([key, value]) => ({ name: key, value })) : [];

  const colors = ['#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans flex justify-center items-start">
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">📊 Tableau de bord CSV</h1>

        <div className="flex justify-center gap-4 mb-6">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 rounded"
          />
          <button
            onClick={handleUpload}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            📤 Uploader
          </button>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {csvPreview && (
          <div className="mb-10 text-center">
            <h2 className="text-xl font-semibold mb-2">📋 Aperçu du CSV</h2>
            <pre className="bg-gray-100 p-4 rounded inline-block text-left">
              {csvPreview}
            </pre>
          </div>
        )}

        {stats && (
          <div className="flex flex-wrap justify-center gap-8">
            <div>
              <h2 className="text-lg font-semibold mb-2">📊 Moyennes</h2>
              <BarChart width={300} height={250} data={renderBarData(stats.mean)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">📊 Médianes</h2>
              <BarChart width={300} height={250} data={renderBarData(stats.median)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">📈 Écarts-types</h2>
              <PieChart width={300} height={250}>
                <Pie
                  data={renderBarData(stats.std)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {renderBarData(stats.std).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
