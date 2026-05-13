<!-- Tariffs Section -->
@if($tariffs->count() > 0)
    <section class="tariffs" id="tariffs">
        <div class="container">
            <div class="tariffs-title">
                @if(!empty($sectionTitles['tariffs']['base']) || !empty($sectionTitles['tariffs']['highlight']))
                    <h2 class="section-title-center">
                        @if(!empty($sectionTitles['tariffs']['highlight']))
                            {{-- Если есть highlight, показываем с выделением --}}
                            @if(!empty($sectionTitles['tariffs']['base']))
                                <span class="section-title-left-base">{{ $sectionTitles['tariffs']['base'] }}</span><br>
                            @endif
                            <span
                                class="section-title-left-highlight">{{ $sectionTitles['tariffs']['highlight'] }}</span>
                        @else
                            {{-- Если нет highlight, показываем весь заголовок без выделения --}}
                            @if(!empty($sectionTitles['tariffs']['base']))
                                {{ $sectionTitles['tariffs']['base'] }}
                            @endif
                        @endif
                    </h2>
                @endif
            </div>
            @if($tariffs->count() > 1)
            <div class="tariff-tabs" id="tariffTabs">
                <div class="tariff-tab-slider" id="tariffTabSlider"></div>
                @foreach($tariffs as $index => $tariff)
                    <button class="tariff-tab {{ $index === 0 ? 'active' : '' }}"
                            data-tariff-type="{{ $tariff->type }}"
                            type="button">{{ $tariff->name }}</button>
                @endforeach
            </div>
            @endif
            <div class="tariffs-grid">
                @foreach($tariffs as $tariff)
                    <div class="tariff-card tariff-{{ $tariff->type }}" @if($tariff->type === 'basic') id="tariff-basic"
                         @elseif($tariff->type === 'premium') id="tariff-premium" @endif>
                        <div class="tariff-header">
                            <h3 class="tariff-name">{{ $tariff->name }}</h3>
                            <div class="tariff-price">{{ number_format($tariff->price, 0, ',', ' ') }}
                                ₽<span>/мес</span></div>
                        </div>
                        <ul class="tariff-features">
                            @foreach($tariff->features ?? [] as $feature)
                                @php
                                    // Поддержка обратной совместимости: если фича - строка, преобразуем в объект
                                    if (is_string($feature)) {
                                        $featureText = $feature;
                                        $showIcon = false;
                                    } else {
                                        $featureText = $feature['text'] ?? '';
                                        $showIcon = $feature['show_icon'] ?? false;
                                    }
                                @endphp
                                <li>
                                    <svg class="check-icon {{ $tariff->type === 'premium' ? 'orange' : 'purple' }}"
                                         viewBox="0 0 19 19" xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                         fill="none">
                                        <rect width="19" height="19" x="0" y="0"/>
                                        <g>
                                            <circle class="check-icon-bg" cx="9.5" cy="9.5" r="8.636"/>
                                            <path
                                                d="M8.47544 12.3057C8.28199 12.3057 8.08854 12.2323 7.94085 12.0846L5.89144 10.0352C5.59608 9.73982 5.59608 9.26136 5.89144 8.96686C6.18681 8.6715 6.6644 8.67064 6.95976 8.966L8.47544 10.4817L12.0405 6.91659C12.3359 6.62123 12.8135 6.62123 13.1089 6.91659C13.4042 7.21195 13.4042 7.69041 13.1089 7.98577L9.01004 12.0846C8.86235 12.2323 8.6689 12.3057 8.47544 12.3057Z"
                                                fill="rgb(255,255,255)" fill-rule="nonzero"/>
                                        </g>
                                    </svg>
                                    <span class="tariff-text">{!! $featureText !!}</span>
                                    @if($showIcon)
                                        <span class="icon-info"></span>
                                    @endif
                                </li>
                            @endforeach
                        </ul>
                        @if($tariff->button_url)
                            <a href="{{ $tariff->button_url }}"
                               class="btn btn-{{ $tariff->type === 'premium' ? 'orange' : 'purple' }} btn-full tariff-cta-button{{ $tariff->type === 'premium' ? ' tariff-cta-button-orange' : '' }}">{{ $tariff->button_text ?? 'Подписаться' }}</a>
                        @else
                            <button
                                class="btn btn-{{ $tariff->type === 'premium' ? 'orange' : 'purple' }} btn-full tariff-cta-button{{ $tariff->type === 'premium' ? ' tariff-cta-button-orange' : '' }}">{{ $tariff->button_text ?? 'Подписаться' }}</button>
                        @endif
                    </div>
                @endforeach
            </div>
        </div>
    </section>
@endif

