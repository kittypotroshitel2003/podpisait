@php
    use Illuminate\Support\Facades\Storage;
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    {{-- SEO мета-теги --}}
    <title>{{ $seo->title ?? 'Подпискайт - первый сервис сайтов по подписке' }}</title>
    @if($seo && isset($seo->description) && $seo->description)
        <meta name="description" content="{{ $seo->description }}">
    @endif
    @if($seo && isset($seo->keywords) && $seo->keywords)
        <meta name="keywords" content="{{ $seo->keywords }}">
    @endif
    <meta name="robots" content="{{ $seo->robots ?? 'index, follow' }}">

    {{-- Open Graph мета-теги --}}
    <meta property="og:type" content="{{ isset($seo->og_type) ? $seo->og_type : 'website' }}">
    <meta property="og:title"
          content="{{ isset($seo->og_title) ? $seo->og_title : (isset($seo->title) ? $seo->title : 'Подпискайт - первый сервис сайтов по подписке') }}">
    @if($seo && ((isset($seo->og_description) && $seo->og_description) || (isset($seo->description) && $seo->description)))
        <meta property="og:description" content="{{ isset($seo->og_description) && $seo->og_description ? $seo->og_description : $seo->description }}">
    @endif
    @if($seo && isset($seo->og_image) && $seo->og_image)
        <meta property="og:image" content="{{ url(Storage::url($seo->og_image)) }}">
    @endif
    <meta property="og:url" content="{{ url()->current() }}">

    {{-- CSRF Token для AJAX запросов --}}
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- Favicon --}}
    @php
        $faviconPath = \App\Models\Setting::getValue('favicon');
    @endphp
    @if($faviconPath)
        <link rel="icon" type="image/x-icon" href="{{ Storage::url($faviconPath) }}?v={{ time() }}">
    @else
        <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">
    @endif

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500&family=Manrope:wght@400;600;700;800&display=swap" rel="stylesheet">
   
    <link rel="stylesheet"
          href="{{ asset('assets/styles.css') }}?v={{ file_exists(public_path('assets/styles.css')) ? filemtime(public_path('assets/styles.css')) : time() }}">
    <!-- Swiper CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
</head>
<body>

{{-- Header --}}
@include('front._partials.header')

{{-- PAGE CONTENT --}}
@yield('content')

{{-- Footer --}}
@include('front._partials.footer')

{{-- Yandex.Metrika --}}
@include('front._partials.yandex-metrika')

{{-- Auth Modal --}}
@include('front._partials.auth-modal')

{{-- Cookie Consent Modal --}}
@include('front._partials.cookie-modal')

{{-- Document Viewer Modal --}}
<div id="docViewerModal" style="display:none; position:fixed; inset:0; z-index:9999; align-items:center; justify-content:center; padding:20px;">
    <div id="docViewerOverlay" style="position:absolute; inset:0; background:rgba(0,0,0,0.55); backdrop-filter:blur(4px); cursor:pointer;"></div>
    <div style="position:relative; width:100%; max-width:860px; height:85vh; background:#fff; border-radius:16px; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 24px 80px rgba(0,0,0,0.25);">
        <div style="display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid rgba(225,227,235,1); flex-shrink:0;">
            <span id="docViewerTitle" style="font-family:var(--font-family-primary,Manrope,sans-serif); font-size:16px; font-weight:700; color:var(--Primary-Black15,#262626); letter-spacing:-0.03em;"></span>
            <button id="docViewerClose" type="button" aria-label="Закрыть" style="width:32px; height:32px; border:none; background:rgba(241,235,255,1); border-radius:8px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background-color 0.2s;">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l12 12M13 1L1 13" stroke="rgba(130,73,242,1)" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
        </div>
        <iframe id="docViewerFrame" src="" style="flex:1; border:none; width:100%;" title="Документ"></iframe>
    </div>
</div>

<!-- GSAP Libraries -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>

<!-- Swiper JS -->
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
<script src="{{ asset('assets/js/swiper-init.js') }}?v={{ file_exists(public_path('assets/js/swiper-init.js')) ? filemtime(public_path('assets/js/swiper-init.js')) : time() }}"></script>

<!-- Additional Solutions Animation -->
<script src="{{ asset('assets/js/additional-solutions-animation.js') }}?v={{ file_exists(public_path('assets/js/additional-solutions-animation.js')) ? filemtime(public_path('assets/js/additional-solutions-animation.js')) : time() }}"></script>

<!-- Typing Animation -->
<script src="{{ asset('assets/js/typing-animation.js') }}?v={{ file_exists(public_path('assets/js/typing-animation.js')) ? filemtime(public_path('assets/js/typing-animation.js')) : time() }}"></script>

<!-- Auth Modal -->
<script src="{{ asset('assets/js/auth-modal.js') }}?v={{ file_exists(public_path('assets/js/auth-modal.js')) ? filemtime(public_path('assets/js/auth-modal.js')) : time() }}"></script>

<!-- Cookie Modal -->
<script src="{{ asset('assets/js/cookie-modal.js') }}?v={{ file_exists(public_path('assets/js/cookie-modal.js')) ? filemtime(public_path('assets/js/cookie-modal.js')) : time() }}"></script>

<script
    src="{{ asset('assets/js/main.js') }}?v={{ file_exists(public_path('assets/js/main.js')) ? filemtime(public_path('assets/js/main.js')) : time() }}"></script>
</body>
</html>
