import { useEffect, useMemo, useState } from "react";
import Button from "../../components/Button/Button";
import { Footer } from "borderless";
import "./Documents.css";
import { useAuth } from "../../contexts/AuthContext";
import { listDocuments } from "../../services/DocumentsService";

type DocType = "contract" | "ir" | "report";

type Doc = {
    id: string;
    name: string;
    type: DocType;
    size: string;
    period?: string;
};

export default function Documents() {
    const { user } = useAuth();
    const [docs, setDocs] = useState<Doc[]>([]);
    const [tab, setTab] = useState<DocType>("contract");
    const list = useMemo(() => docs.filter(d => d.type === tab), [docs, tab]);

    useEffect(() => {
        const run = async () => {
            if (!user?.id) return;
            const data = await listDocuments(user.id, tab);
            setDocs(data as any);
        };
        run();
    }, [user?.id, tab]);

    return (
        <div className="documents-page-wrapper">
            <div className="documents-container">
                <h1>Documentos</h1>
                <div className="tabs">
                    <button className={`tab ${tab === 'contract' ? 'active' : ''}`} onClick={() => setTab('contract')}>Contratos</button>
                    <button className={`tab ${tab === 'ir' ? 'active' : ''}`} onClick={() => setTab('ir')}>IR</button>
                    <button className={`tab ${tab === 'report' ? 'active' : ''}`} onClick={() => setTab('report')}>Relatórios</button>
                </div>
                <div className="list">
                    {list.length === 0 ? (
                        <div className="empty">Nenhum documento.</div>
                    ) : list.map((d) => (
                        <div key={d.id} className="doc">
                            <div className="meta">
                                <h4>{d.name}</h4>
                                <span>{d.period}</span>
                            </div>
                            <span className="size">{d.size}</span>
                            <Button variant="secondary" size="small">Download</Button>
                        </div>
                    ))}
                </div>
            </div>
            <Footer theme="light" useGradient={false} backgroundColor="transparent" logoVariant="light" />
        </div>
    );
}


