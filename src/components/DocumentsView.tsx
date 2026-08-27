import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  ArrowUpDown, 
  LayoutGrid, 
  List, 
  MoreVertical, 
  FileText, 
  Trash2, 
  Edit3, 
  X, 
  ArrowUp,
  Globe,
  Upload
} from "lucide-react";

export interface DocumentCardItem {
  id: string;
  date: string;
  title: string;
  type: "Uploaded" | "Scraped" | "Created Manually";
  fileFormat?: "PDF" | "DOCX" | "TXT" | "WEB";
  fileSize?: string;
  content?: string;
  sourceUrl?: string;
}

export const INITIAL_DOCUMENTS: DocumentCardItem[] = [
  {
    id: "doc-1",
    date: "AUG 20, 2026",
    title: "couchbase.pdf",
    type: "Uploaded",
    fileFormat: "PDF",
    fileSize: "204 KB",
    content: "Couchbase cluster architecture, memory-first caching engine, cross datacenter replication (XDCR), and N1QL indexing strategies."
  },
  {
    id: "doc-2",
    date: "JUL 24, 2026",
    title: "Interview Data.pdf",
    type: "Uploaded",
    fileFormat: "PDF",
    content: "Technical screening question bank covering distributed lock patterns, consensus protocols (Raft, Paxos), and database sharding."
  },
  {
    id: "doc-3",
    date: "JUL 3, 2026",
    title: "Introduction infosys.docx",
    type: "Uploaded",
    fileFormat: "DOCX",
    content: "Company background and client project summaries: core banking modernization, microservice decomposition, and enterprise compliance."
  },
  {
    id: "doc-4",
    date: "JUN 23, 2026",
    title: "IBM",
    type: "Created Manually",
    content: "IBM Cloud and Watson AI architecture talking points. Hybrid cloud OpenShift deployment models and enterprise API gateways."
  },
  {
    id: "doc-5",
    date: "JUN 20, 2026",
    title: "tech marine",
    type: "Created Manually",
    content: "Marine IoT telemetry ingestion notes: edge device MQTT publishers, time-series TimescaleDB storage, and anomaly detection algorithms."
  },
  {
    id: "doc-6",
    date: "JUN 17, 2026",
    title: "Amazon BA",
    type: "Created Manually",
    content: "Amazon Business Analysis & Leadership Principles: Customer Obsession, Ownership, Bias for Action metrics-driven examples."
  },
  {
    id: "doc-7",
    date: "MAY 30, 2026",
    title: "Kafka Architecture Cheatsheet",
    type: "Created Manually",
    content: "Partition rebalancing, consumer lag monitoring, idempotency keys for exactly-once semantics, and Kafka Streams topologies."
  },
  {
    id: "doc-8",
    date: "MAY 15, 2026",
    title: "System Design Scalability Patterns",
    type: "Scraped",
    fileFormat: "WEB",
    sourceUrl: "https://highscalability.com/patterns",
    content: "Scraped architecture summary: CDN caching layers, write-through vs write-back cache, consistent hashing rings, and circuit breakers."
  },
  {
    id: "doc-9",
    date: "APR 28, 2026",
    title: "Google SRE Incident Runbook",
    type: "Uploaded",
    fileFormat: "PDF",
    fileSize: "340 KB",
    content: "Blameless post-mortem framework, error budget calculation, SLO/SLA management, and canary rollback thresholds."
  },
  {
    id: "doc-10",
    date: "APR 10, 2026",
    title: "SQL vs NoSQL Benchmark Study",
    type: "Scraped",
    fileFormat: "WEB",
    sourceUrl: "https://db-engines.com/ranking",
    content: "ACID vs BASE consistency models, PostgreSQL B-tree vs BRIN indexing, MongoDB document sharding, and DynamoDB single-digit ms reads."
  }
];

export const DocumentsView: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentCardItem[]>(() => {
    try {
      const saved = localStorage.getItem("runtime_realtek_documents_list");
      return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
    } catch {
      return INITIAL_DOCUMENTS;
    }
  });

  const [activeTab, setActiveTab] = useState<"All" | "Uploaded" | "Scraped" | "Created Manually">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"upload" | "scrape" | "manual">("upload");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<DocumentCardItem | null>(null);

  const saveDocuments = (updated: DocumentCardItem[]) => {
    setDocuments(updated);
    try {
      localStorage.setItem("runtime_realtek_documents_list", JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage error:", e);
    }
  };

  const filteredDocs = documents.filter((d) => {
    const matchesTab = 
      activeTab === "All" ? true :
      activeTab === "Uploaded" ? d.type === "Uploaded" :
      activeTab === "Scraped" ? d.type === "Scraped" :
      d.type === "Created Manually";

    const matchesSearch = 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.content && d.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
      d.date.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleDeleteDoc = (id: string) => {
    const updated = documents.filter((d) => d.id !== id);
    saveDocuments(updated);
    setActiveMenuId(null);
    if (selectedDoc?.id === id) {
      setSelectedDoc(null);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let docType: DocumentCardItem["type"] = "Created Manually";
    let fileFormat: DocumentCardItem["fileFormat"] = "TXT";

    if (modalTab === "upload") {
      docType = "Uploaded";
      fileFormat = "PDF";
    } else if (modalTab === "scrape") {
      docType = "Scraped";
      fileFormat = "WEB";
    }

    const newDoc: DocumentCardItem = {
      id: `doc-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase(),
      title: newTitle.trim(),
      type: docType,
      fileFormat,
      sourceUrl: scrapeUrl.trim() || undefined,
      content: newContent.trim() || "Grounding document content parsed and stored for copilot context."
    };

    saveDocuments([newDoc, ...documents]);
    setNewTitle("");
    setNewContent("");
    setScrapeUrl("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex-1 bg-[#0d0f12] text-slate-100 min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Documents
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Add documents for more relevant AI answers.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => {
              setModalTab("upload");
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#10a37f] hover:bg-[#0e8e6e] active:scale-95 text-white font-bold text-xs shadow-lg shadow-[#10a37f]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Document</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between pt-4 border-b border-white/10 text-sm">
        <div className="flex items-center gap-6">
          {(["All", "Uploaded", "Scraped", "Created Manually"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-semibold transition-colors relative cursor-pointer ${
                activeTab === tab ? "text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 pb-3 font-medium">
          {filteredDocs.length} {filteredDocs.length === 1 ? "Document" : "Documents"}
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="flex items-center justify-between gap-3 py-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by documents"
            className="w-full bg-[#16181e] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <button 
            className="p-2.5 rounded-xl bg-[#16181e] border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Sort documents"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>

          <div className="flex items-center bg-[#16181e] border border-white/10 rounded-xl p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                viewMode === "grid" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                viewMode === "list" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View - Dark Emerald Pine Green Cards */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className="bg-[#122422] hover:bg-[#162c2a] border border-[#1f423e] hover:border-[#2b5c57] rounded-2xl p-5 transition-all shadow-lg flex flex-col justify-between group relative cursor-pointer min-h-[175px]"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono font-medium mb-3">
                  <span className="uppercase tracking-wider text-[11px] text-slate-400">
                    {doc.date}
                  </span>
                  
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === doc.id ? null : doc.id)}
                      className="p-1 text-slate-400 hover:text-white transition-colors rounded-md hover:bg-white/10 cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === doc.id && (
                      <div className="absolute right-0 mt-1 w-40 bg-[#161a23] border border-white/10 rounded-xl shadow-2xl py-1 z-30 text-xs">
                        <button
                          onClick={() => {
                            setSelectedDoc(doc);
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3 py-2 text-slate-200 hover:bg-white/10 flex items-center gap-2 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                          <span>View Content</span>
                        </button>
                        <div className="h-px bg-white/10 my-1" />
                        <button
                          onClick={() => handleDeleteDoc(doc.id)}
                          className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1 mb-4">
                  {doc.title}
                </h3>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1a3834] text-slate-200 text-[11px] font-medium border border-white/5 mb-3">
                  {doc.type === "Uploaded" ? (
                    <ArrowUp className="w-3 h-3 text-emerald-400" />
                  ) : doc.type === "Scraped" ? (
                    <Globe className="w-3 h-3 text-cyan-400" />
                  ) : (
                    <Edit3 className="w-3 h-3 text-emerald-300" />
                  )}
                  <span>{doc.type}</span>
                </div>

                <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                  <span>{doc.fileFormat || (doc.type === "Created Manually" ? "" : "PDF")}</span>
                  {doc.fileSize && (
                    <>
                      <span>•</span>
                      <span>{doc.fileSize}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2 pt-2">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className="bg-[#122422] hover:bg-[#162c2a] border border-[#1f423e] rounded-xl p-4 flex items-center justify-between transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="text-[11px] font-mono text-slate-400 w-28 shrink-0">
                  {doc.date}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">{doc.title}</h4>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{doc.type}</span>
                    <span>•</span>
                    <span>{doc.fileFormat || "PDF"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleDeleteDoc(doc.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Document Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#14161c] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Add Context Document
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Segment Tabs */}
            <div className="flex items-center bg-[#1c1f28] p-1 rounded-xl border border-white/5 text-xs">
              <button
                type="button"
                onClick={() => setModalTab("upload")}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalTab === "upload" ? "bg-[#10a37f] text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab("scrape")}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalTab === "scrape" ? "bg-[#10a37f] text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Scrape URL</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab("manual")}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalTab === "manual" ? "bg-[#10a37f] text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Create Manually</span>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Document Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={modalTab === "upload" ? "e.g. System_Design_Cheatsheet.pdf" : modalTab === "scrape" ? "e.g. Company Engineering Blog" : "e.g. AWS Troubleshooting Guide"}
                  className="w-full bg-[#1c1f28] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              {modalTab === "scrape" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">URL to Scrape</label>
                  <input
                    type="url"
                    value={scrapeUrl}
                    onChange={(e) => setScrapeUrl(e.target.value)}
                    placeholder="https://engineering.company.com/architecture"
                    className="w-full bg-[#1c1f28] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Content / Notes</label>
                <textarea
                  rows={5}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste documentation, architecture diagrams in text, interview questions, or cheat sheets..."
                  className="w-full bg-[#1c1f28] border border-white/10 rounded-xl p-3.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 leading-relaxed font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#10a37f] hover:bg-[#0e8e6e] text-white font-bold text-xs cursor-pointer"
                >
                  Add Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#14161c] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <h3 className="text-sm font-bold text-white">{selectedDoc.title}</h3>
                <span className="text-[10px] text-slate-400 font-mono">{selectedDoc.date} • {selectedDoc.type}</span>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#1c1f28] rounded-xl p-4 text-xs text-slate-200 leading-relaxed font-mono max-h-60 overflow-y-auto">
              {selectedDoc.content || "Grounding document indexed for real-time interview answers."}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};