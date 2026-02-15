
import Link from "next/link";
import { ArrowRight, PenTool, Printer, Image as ImageIcon, Sparkles, LayoutTemplate, ScanSearch, Plus, Hammer, Ruler, Palette, FileText, Component } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DashboardHome() {
  return (
    <main className="min-h-screen bg-slate-50 selection:bg-purple-100 selection:text-purple-900">

      {/* Light Nebula Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-200/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-200/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[600px] h-[600px] bg-white/60 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-20 animate-in fade-in duration-700">

        {/* Header */}
        <header className="mb-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-500 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span className="tracking-wide uppercase">Integrated Creative Platform</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
            Creative <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Console</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            기획부터 인쇄 감리까지. 전문가를 위한 올인원 워크스페이스.
          </p>
        </header>

        {/* Modules Grid (3x3 Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[320px]">

          {/* Slot 1: Contents Studio (Active) */}
          <Link href="/studio" className="group relative h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-3xl transform group-hover:scale-[1.02] transition-transform duration-500" />
            <div className="relative h-full bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-500/10 rounded-3xl p-8 transition-all duration-300 ring-1 ring-slate-100 group-hover:ring-purple-200 flex flex-col justify-between">

              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl flex items-center justify-center text-purple-600 shadow-inner ring-1 ring-white">
                    <PenTool className="w-7 h-7" />
                  </div>
                  <Badge className="bg-slate-900 text-white hover:bg-slate-800 px-2.5 py-1 text-xs shadow-sm">Active</Badge>
                </div>

                <h2 className="text-2xl font-extrabold text-slate-900 mb-2 group-hover:text-purple-700 transition-colors">Contents Studio</h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  전단지, 포스터, 리플렛 등<br />
                  마케팅 자산의 문구와 기획안 생성.
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-xs text-slate-400 font-bold shadow-sm" title="Flyer">FL</div>
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-xs text-slate-400 font-bold shadow-sm" title="Leaflet">LF</div>
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-xs text-slate-400 font-bold shadow-sm" title="Poster">PS</div>
                </div>
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg shadow-purple-200 transform translate-x-[-10px] group-hover:translate-x-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

            </div>
          </Link>

          {/* Slot 2: QC Lab (Coming Soon) */}
          <div className="relative group cursor-not-allowed opacity-70 hover:opacity-100 transition-opacity h-full">
            <div className="h-full bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 flex flex-col justify-between hover:bg-white hover:border-slate-200 transition-colors">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    <Printer className="w-6 h-6" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wide border border-slate-200">Coming Soon</span>
                </div>

                <h2 className="text-xl font-bold text-slate-400 mb-2 group-hover:text-slate-600 transition-colors">QC Lab</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  인쇄 사고 방지를 위한<br />프리플라이트(Pre-flight) 및 감리 도구.
                </p>
              </div>
              <div className="mt-auto pt-6 border-t border-slate-100/50">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Hammer className="w-3 h-3" />
                  <span>PDF 검수 / 색상 시뮬레이션</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slot 3: Visual Booster (Coming Soon) */}
          <div className="relative group cursor-not-allowed opacity-70 hover:opacity-100 transition-opacity h-full">
            <div className="h-full bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 flex flex-col justify-between hover:bg-white hover:border-slate-200 transition-colors">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wide border border-slate-200">Coming Soon</span>
                </div>

                <h2 className="text-xl font-bold text-slate-400 mb-2 group-hover:text-slate-600 transition-colors">Visual Booster</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  저해상도 이미지를 위한<br />AI 기반 업스케일링 및 벡터 변환.
                </p>
              </div>
              <div className="mt-auto pt-6 border-t border-slate-100/50">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Ruler className="w-3 h-3" />
                  <span>4x Upscaling / Vectorizer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slot 4: Layout Genius (Dummy) */}
          <div className="relative group cursor-not-allowed opacity-40 hover:opacity-60 transition-opacity h-full">
            <div className="h-full border border-dashed border-slate-300 rounded-3xl p-8 flex flex-col justify-center items-center text-center bg-slate-50/50">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                <LayoutTemplate className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-400 mb-1">Layout Genius</h3>
              <p className="text-xs text-slate-400">AI 레이아웃 추천</p>
            </div>
          </div>

          {/* Slot 5: Brand Kit (Dummy) */}
          <div className="relative group cursor-not-allowed opacity-40 hover:opacity-60 transition-opacity h-full">
            <div className="h-full border border-dashed border-slate-300 rounded-3xl p-8 flex flex-col justify-center items-center text-center bg-slate-50/50">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-400 mb-1">Brand Kit</h3>
              <p className="text-xs text-slate-400">브랜드 색상/로고 관리</p>
            </div>
          </div>

          {/* Slot 6: Analytics (Dummy) */}
          <div className="relative group cursor-not-allowed opacity-40 hover:opacity-60 transition-opacity h-full">
            <div className="h-full border border-dashed border-slate-300 rounded-3xl p-8 flex flex-col justify-center items-center text-center bg-slate-50/50">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-400 mb-1">Analytics</h3>
              <p className="text-xs text-slate-400">성과 분석 리포트</p>
            </div>
          </div>

          {/* Slot 7: Integration (Dummy) */}
          <div className="relative group cursor-not-allowed opacity-40 hover:opacity-60 transition-opacity h-full">
            <div className="h-full border border-dashed border-slate-300 rounded-3xl p-8 flex flex-col justify-center items-center text-center bg-slate-50/50">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                <Component className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-400 mb-1">Integration</h3>
              <p className="text-xs text-slate-400">외부 서비스 연동</p>
            </div>
          </div>

          {/* Slot 8: Settings (Dummy) */}
          <div className="relative group cursor-not-allowed opacity-40 hover:opacity-60 transition-opacity h-full">
            <div className="h-full border border-dashed border-slate-300 rounded-3xl p-8 flex flex-col justify-center items-center text-center bg-slate-50/50">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                <ScanSearch className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-400 mb-1">Settings</h3>
              <p className="text-xs text-slate-400">계정 및 설정</p>
            </div>
          </div>

          {/* Slot 9: Add New (Dummy) */}
          <div className="relative group cursor-pointer hover:bg-slate-100/50 transition-colors h-full">
            <div className="h-full border border-dashed border-slate-300 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-400 mb-1 group-hover:text-slate-600">Add Module</h3>
              <p className="text-xs text-slate-400">새로운 모듈 추가</p>
            </div>
          </div>

        </div>

        {/* Footer Info */}
        <div className="mt-20 text-center border-t border-slate-200 pt-8">
          <p className="text-slate-400 text-sm font-medium">
            © 2026 Creative Console. All tools are optimized for verified print standards.
          </p>
        </div>

      </div>
    </main>
  );
}
