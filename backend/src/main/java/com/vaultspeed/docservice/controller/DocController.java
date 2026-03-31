package com.vaultspeed.docservice.controller;

import com.vaultspeed.docservice.model.DocRequest;
import com.vaultspeed.docservice.model.DocResponse;
import com.vaultspeed.docservice.service.DocFetchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/docs")
@CrossOrigin(origins = "http://localhost:5173")
public class DocController {

    private final DocFetchService docFetchService;

    public DocController(DocFetchService docFetchService) {
        this.docFetchService = docFetchService;
    }

    @PostMapping("/fetch")
    public ResponseEntity<DocResponse> fetchDocs(@RequestBody DocRequest request) {
        if (request.dataPlatform() == null || request.cicdTool() == null || request.orchestrationTool() == null) {
            return ResponseEntity.badRequest().build();
        }

        DocResponse response = docFetchService.fetchDocs(
                request.dataPlatform(),
                request.cicdTool(),
                request.orchestrationTool()
        );

        return ResponseEntity.ok(response);
    }
}
