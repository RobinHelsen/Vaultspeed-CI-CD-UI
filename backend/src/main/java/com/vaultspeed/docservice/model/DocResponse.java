package com.vaultspeed.docservice.model;

public record DocResponse(
        DocSection platform,
        DocSection cicd,
        DocSection orchestration
) {}
