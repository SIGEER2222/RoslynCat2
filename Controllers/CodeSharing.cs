﻿using Newtonsoft.Json.Linq;
using RoslynCat.Interface;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;

namespace RoslynCat.Controllers
{
    public class CodeSharing : IGistService
    {
        public Langauage Langauage { get; set; } = Langauage.CSharp;
        public string FileName { get; set; } = "UserCode.cs";
        public string Description { get; set; } = "Testing...";
        public string Code { get; set; }
        public string GistId { get; set; }
        private string token  = "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";
        private string url = "https://api.github.com";
        public async Task CreateGistAsync(string code) {
            if (code is null) return;

            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.UserAgent.Add(new ProductInfoHeaderValue("GistExample","1.0"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Token",token);

            // Create the Gist
            var createGistContent = new JObject
            {
                {"description", Description},
                {"public", true},
                {"files", new JObject {{ FileName, new JObject {{"content",code } }}}}
            };
            var createGistResponse = await httpClient.PostAsync(
                $"{url}/gists",
                new StringContent(createGistContent.ToString(), Encoding.UTF8, "application/json"));
            createGistResponse.EnsureSuccessStatusCode();

            // Get the created Gist's URL from the response
            var createdGist = JObject.Parse(await createGistResponse.Content.ReadAsStringAsync());
            var createdGistUrl = createdGist["html_url"].Value<string>();
            GistId = createdGistUrl.Split('/').Last();
        }

        public async Task<string> GetGistContentAsync(string gistId) {
            if (gistId is null) return string.Empty;

            HttpClient httpClient = new HttpClient();
            var getGistResponse = await httpClient.GetAsync($"{url}/gists/{gistId}");
            getGistResponse.EnsureSuccessStatusCode();
            var gist = JObject.Parse(await getGistResponse.Content.ReadAsStringAsync());
            var gistContent = gist["files"][FileName]["content"].Value<string>();

            return gistContent;
        }

    }
}
