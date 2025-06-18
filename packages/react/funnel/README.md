
# @guesung/funnel

## 개요

`@guesung/funnel`은 React 환경에서 단계별 UI 흐름(퍼널, Wizard, Stepper 등)을 쉽고 일관되게 구현할 수 있도록 지원하는 컴포넌트/훅 집합입니다.  
각 단계별 화면 전환, 상태 관리, 유효성 검사, 이동 제어 등 퍼널 UI의 핵심 패턴을 추상화하여 제공합니다.

- **대상:** 설문, 회원가입, 결제, 온보딩 등 여러 단계를 거치는 UI를 React로 구현하려는 개발자
- **효과:** 복잡한 퍼널/스텝 UI를 재사용 가능하고 예측 가능한 방식으로 설계·구현할 수 있습니다.

---

## 주요 특징

1. **단계별 렌더링**  
   각 스텝(단계)별로 컴포넌트를 분리하여 선언적으로 관리할 수 있습니다.

2. **상태 및 이동 제어**  
   현재 단계, 전체 단계, 이전/다음 이동, 완료 처리 등 퍼널 흐름을 일관되게 제어할 수 있습니다.

3. **유효성 검사 및 조건부 이동**  
   각 단계별 유효성 검사, 조건부 이동(스킵/점프) 등 복잡한 시나리오를 지원합니다.

4. **커스텀 훅 제공**  
   `useFunnel` 등 커스텀 훅을 통해 퍼널 상태와 제어 함수를 간편하게 사용할 수 있습니다.

5. **유연한 컴포넌트 조합**  
   다양한 UI/UX 요구에 맞게 퍼널/스텝 컴포넌트를 자유롭게 조합할 수 있습니다.

---

## 사용법

### 1. 기본 퍼널 구현

```tsx
import { Funnel, Step, useFunnel } from '@guesung/funnel';

function SignupFunnel() {
  const { currentStep, goNextStep, goPrevStep } = useFunnel([1,2,3]);

  return (
    <Funnel currentStep={currentStep}>
      <Step index={1}>
        <InfoForm onNext={goNextStep} />
      </Step>
      <Step index={2}>
        <VerifyForm onNext={goNextStep} onPrev={goPrevStep} />
      </Step>
      <Step index={3}>
        <DoneScreen />
      </Step>
    </Funnel>
  );
}
```

### 2. 커스텀 훅으로 퍼널 상태/이동 제어

```tsx
const steps = ['step1', 'step2', 'step3'];
const { currentStep, goNextStep, goPrevStep, resetStep } = useFunnel(steps);

if (currentStep === steps.length - 1) {
  // 마지막 단계 처리
}

if (currentStep === 1) {
  // 첫 단계 처리
}
```

---

## API

### Funnel

- **props**
  - `currentStep`: 현재 활성화된 단계 이름
  - `children`: `<Step index="...">...</Step>` 형태의 자식 컴포넌트

### Step

- **props**
  - `index`: 단계 고유 이름(문자열)
  - `children`: 해당 단계에서 렌더링할 컴포넌트

### useFunnel(steps: string[])

- **steps**: 단계 이름 배열(순서대로)
- **return**
  - `currentStep`: 현재 단계 이름
  - `goNextStep()`: 다음 단계로 이동
  - `goPrevStep()`: 이전 단계로 이동
  - `goTo(stepName: string)`: 특정 단계로 이동
  - `resetStep`: 단계 초기화

---

## 동작/옵션 규칙

- `useFunnel`의 `steps` 배열 순서대로 단계가 진행됩니다.
- `goNextStep`, `goPrevStep`, `goTo` 등 이동 함수는 현재 단계와 전체 단계 정보를 기반으로 동작합니다.
- 각 단계별 유효성 검증, 조건부 이동 등은 필요에 따라 직접 구현할 수 있습니다.

---

## 주의사항

- 퍼널 단계별로 반드시 고유한 `index`을 부여해야 합니다.
- 상태/이동 제어 로직은 `useFunnel` 훅을 통해 일관되게 관리하는 것이 권장됩니다.
- 복잡한 분기/점프/스킵 등은 `goTo`와 조건문을 조합해 구현하세요.
