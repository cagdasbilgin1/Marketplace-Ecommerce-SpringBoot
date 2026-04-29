package com.marketplace.catalog.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class SlugGeneratorTest {

    private final SlugGenerator slugGenerator = new SlugGenerator();

    @Test
    void generatesAsciiSlugForTurkishText() {
        assertThat(slugGenerator.generate("Kablosuz Şarj Cihazı")).isEqualTo("kablosuz-sarj-cihazi");
    }

    @Test
    void usesFallbackForBlankInput() {
        assertThat(slugGenerator.generate("   ")).isEqualTo("item");
    }
}
