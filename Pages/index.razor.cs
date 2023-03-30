

using Microsoft.AspNetCore.Components;
using Microsoft.CodeAnalysis;
using Microsoft.JSInterop;
using RoslynCat.Controllers;
using RoslynCat.Roslyn;

namespace RoslynCat.Pages
{
    public partial class Index
    {
        public List<Diagnostic> Diagnostics { get; set; }
        [Inject] Compiler CompliterService { get; set; }
        [Inject] IJSRuntime JS { get; set; }
        private string result = "�ȴ�����...";
        private string shareId = string.Empty;
        protected override void OnParametersSet() {
            //this.MonacoService.DiagnosticsUpdated += this.OnDiagnosticsUpdated;
            base.OnParametersSet();
        }

        protected override async Task OnAfterRenderAsync(bool firstRender) {
            if (firstRender) {
                Console.WriteLine("��һ�μ���");
                JsRuntimeExt.Shared = JS;
                await JsRuntimeExt.Shared.CreateMonacoEditorAsync(editorId,code);
                await CompliterService.CreatCompilation(code);
            }
        }

        protected async Task Test() {
            code = await JsRuntimeExt.Shared.GetValue(editorId);
            result = CompliterService.CompileAndRun(code);
            await Console.Out.WriteLineAsync(result);
        }
        protected async Task CodeSharing() {
            code = await JsRuntimeExt.Shared.GetValue(editorId);
            if (string.IsNullOrEmpty(code)) return;
            CodeSharing share = new CodeSharing();
            await share.CreateGistAsync(code);
            shareId = share.GistId;
        }

        private void OnDiagnosticsUpdated(object sender,List<Diagnostic> diagnostics) {
            Diagnostics = diagnostics;
            InvokeAsync(() => { this.StateHasChanged(); });
            //_ = JS.SetMonacoDiagnosticsAsync(_editorId, diagnostics);
        }
    }

}