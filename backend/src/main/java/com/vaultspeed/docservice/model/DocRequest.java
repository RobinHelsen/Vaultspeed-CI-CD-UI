package com.vaultspeed.docservice.model;

public record DocRequest(
        String dataPlatform,
        String cicdTool,
        String orchestrationTool
) {}
