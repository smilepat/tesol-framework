# Vercel 환경변수 추가 스크립트
$vars = @(
    @{name='NEXT_PUBLIC_FIREBASE_API_KEY'; value='AIzaSyCWCSsQ1cboE_ojrxpzRjn2zs92_YKtxCs'},
    @{name='NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'; value='tesol-framework.firebaseapp.com'},
    @{name='NEXT_PUBLIC_FIREBASE_PROJECT_ID'; value='tesol-framework'},
    @{name='NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'; value='tesol-framework.firebasestorage.app'},
    @{name='NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'; value='604746589154'},
    @{name='NEXT_PUBLIC_FIREBASE_APP_ID'; value='1:604746589154:web:f880151d5194030a510fbb'},
    @{name='GEMINI_API_KEY'; value='AIzaSyAgqkWTqfzvQJxuVN9ejiFkotodO7X35y8'}
)

$envs = @('production', 'preview', 'development')

foreach($env in $envs) {
    foreach($var in $vars) {
        Write-Host "Adding $($var.name) to $env..." -ForegroundColor Cyan
        vercel env add $var.name $env --value $var.value --yes
    }
}

Write-Host "완료!" -ForegroundColor Green
