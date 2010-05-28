<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:func="http://exslt.org/functions"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
    xmlns:foaf="http://xmlns.com/foaf/0.1/"
    xmlns:yafoaf="http://blogs.yandex.ru/schema/foaf/"
    xmlns:dc="http://purl.org/dc/elements/1.1/">

    <xsl:output
        encoding="UTF-8"
        method="text"
        indent="yes"
    />

    <xsl:template match="/">
        <xsl:text>{</xsl:text>
        <xsl:apply-templates select="rdf:RDF/foaf:Person" mode="person"/>
        <xsl:text>}</xsl:text>
        <xsl:text>&#10;</xsl:text>
    </xsl:template>

    <xsl:template match="rdf:RDF/foaf:Person" mode="person">
        <xsl:text>'nick':'</xsl:text>
        <xsl:value-of select="foaf:nick"/>
        <xsl:text>',</xsl:text>
        <xsl:text>&#10;</xsl:text>
        <xsl:text>'friends':[</xsl:text>
        <xsl:apply-templates select="foaf:knows/foaf:Person/rdfs:seeAlso" mode="knows"/>
        <xsl:text>],</xsl:text>
        <xsl:text>&#10;</xsl:text>
        <xsl:text>'next':[</xsl:text>
        <xsl:apply-templates select="rdfs:seeAlso" mode="knows"/>
        <xsl:text>]</xsl:text>
    </xsl:template>

    <xsl:template match="rdfs:seeAlso" mode="knows">
        <xsl:text>'</xsl:text>
        <xsl:value-of select="@rdf:resource" disable-output-escaping="yes"/>
        <xsl:text>'</xsl:text>
        <xsl:if test="position() != last()">
            <xsl:text>,</xsl:text>
        </xsl:if>
    </xsl:template>
    
</xsl:stylesheet>
