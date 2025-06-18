
# @guesung/component

## 개요

`@guesung/component`는 프레임워크에 종속되지 않는 순수 JavaScript 기반의 UI 컴포넌트 추상화 클래스입니다.  
상태 관리, 템플릿 렌더링, 옵저버 패턴 등 핵심 UI 패턴을 직접 구현/확장할 수 있도록 설계되었습니다.

- **대상:** Vanilla JS 기반 UI 프레임워크를 직접 만들고 싶거나, 프레임워크의 동작 원리를 학습하고 싶은 개발자
- **효과:** 상태 기반 UI 렌더링, 옵저버 패턴, 컴포넌트 트리 구조 등 프론트엔드 핵심 개념을 직접 구현/확장할 수 있습니다.

---

## 주요 특징

1. **상태 기반 렌더링**  
   `setState` 호출 시 자동으로 DOM이 갱신됩니다.

2. **템플릿 함수**  
   템플릿 리터럴(`html`) 기반의 선언적 UI 작성이 가능합니다.

3. **옵저버 패턴**  
   외부 상태(스토어) 구독 및 자동 업데이트를 지원합니다.

4. **이벤트/라이프사이클**  
   `setup`, `addEventListener`, `onRender`, `onUnmount` 등 확장 지점을 제공합니다.

5. **Slot/조합**  
   `fillSlot` 메서드로 컴포넌트 조합이 가능합니다.

---

## 사용법

### 1. 인스턴스 생성 및 기본 사용

```ts
import { Component, html } from '@guesung/component';

// Component를 상속해 새로운 컴포넌트 정의
class Counter extends Component<{ initial: number }, { count: number }> {
  setup() {
    this.state = { count: this.props.initial ?? 0 };
  }

  template() {
    return html`<button id="inc">Count: ${this.state.count}</button>`;
  }

  addEventListener() {
    this.element.addEventListener('click', () => {
      this.setState({ count: this.state.count + 1 });
    });
  }
}

// 인스턴스 생성 및 DOM에 추가
const counter = new Counter({ initial: 0 });
document.body.appendChild(counter.element);
```

### 2. 상태/옵저버 패턴 활용

```ts
// 예: 외부 스토어(Observable)와 연동
// store.subscribe(counter.update.bind(counter));
```

---

## API

### Component<TProps, TState>

- **props**: 생성자에서 주입되는 컴포넌트 속성 객체
- **state**: 컴포넌트의 상태 객체 (`setState`로 갱신)
- **element**: 실제 DOM 요소 (초기화 후 접근 가능)
- **template()**: 렌더링할 HTML 문자열 반환 (html 템플릿 리터럴 사용)
- **setState(nextState)**: 상태 일부 갱신 및 자동 렌더링
- **addEventListener()**: 이벤트 바인딩 지점 (초기화 시 자동 호출)
- **setup()**: 초기화 로직 (생성자에서 자동 호출)
- **onRender()**: 렌더 직후 호출 (DOM 접근 안전)
- **onUnmount()**: 컴포넌트 제거 시 호출
- **fillSlot(component, slotName)**: slot 교체(조합) 지원
- **remove()**: DOM에서 제거 및 언마운트 처리
- **subscribe(stores)**: 외부 옵저버블(스토어) 구독

#### 유틸 함수

- **html**: 템플릿 리터럴 기반 HTML 문자열 생성
- **$**: DOM 쿼리 셀렉터 (내부적으로 사용)

#### 타입

- **StrictObject**: `{ [key: string]: unknown }` (length 속성 금지)
- **HTMLType**: HTML 문자열 브랜드 타입

---

## 동작/옵션 규칙

- `setState` 호출 시 변경된 상태만 병합되어 자동으로 렌더링됩니다.
- `addEventListener`, `setup` 등 라이프사이클 메서드는 필요에 따라 선택적으로 구현할 수 있습니다.
- 외부 옵저버블(스토어)와 연동 시 `subscribe` 메서드를 사용합니다.

---

## 주의사항

- React/Vue 등 프레임워크의 Virtual DOM, diffing, 고수준 상태 관리 기능은 제공하지 않습니다.
- DOM 조작, 상태 관리, 옵저버 패턴 등 핵심 로직을 직접 구현/확장하는 데 초점을 둡니다.
- 템플릿 함수(`template`)는 반드시 `html` 유틸을 사용해 반환해야 합니다.
