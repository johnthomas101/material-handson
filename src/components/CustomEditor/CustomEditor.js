import React, {useState, useMemo, useCallback} from 'react';
import { EditorState, RichUtils, convertToRaw, convertFromRaw, ContentState} from 'draft-js';
import 'draft-js/dist/Draft.css';
import './CustomEditor.css';
import { 
    Button, 
} from '@material-ui/core';
import {stateToHTML} from 'draft-js-export-html';
import createMentionPlugin, {
    defaultSuggestionsFilter,
  } from '@draft-js-plugins/mention';
import Editor from '@draft-js-plugins/editor';
import '@draft-js-plugins/mention/lib/plugin.css';
import editorStyles from './SimpleMentionEditor.module.css';


const mentions = [
    {
      name: 'Matthew Russell',
      link: 'https://twitter.com/mrussell247',
      avatar:
        'https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg',
    },
    {
      name: 'Julian Krispel-Samsel',
      link: 'https://twitter.com/juliandoesstuff',
      avatar: 'https://avatars2.githubusercontent.com/u/1188186?v=3&s=400',
    },
    {
      name: 'Jyoti Puri',
      link: 'https://twitter.com/jyopur',
      avatar: 'https://avatars0.githubusercontent.com/u/2182307?v=3&s=400',
    },
    {
      name: 'Max Stoiber',
      link: 'https://twitter.com/mxstbr',
      avatar: 'https://avatars0.githubusercontent.com/u/7525670?s=200&v=4',
    },
    {
      name: 'Nik Graf',
      link: 'https://twitter.com/nikgraf',
      avatar: 'https://avatars0.githubusercontent.com/u/223045?v=3&s=400',
    },
    {
      name: 'Pascal Brandt',
      link: 'https://twitter.com/psbrandt',
      avatar:
        'https://pbs.twimg.com/profile_images/688487813025640448/E6O6I011_400x400.png',
    },
  ];

function CustomEditor(props) {
    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),
    );
    
    const [open, setOpen] = useState(false);

    const [suggestions, setSuggestions] = useState(mentions);

    React.useEffect(() => {
        if(props.detailsObj){
            console.log('question details', props.detailsObj)
            // debugger
            let content = convertFromRaw(props.detailsObj)
            setEditorState(EditorState.createWithContent(content))
        } else {
            console.log('empty editor')
        }
    }, []);

    const { MentionSuggestions, plugins } = useMemo(() => {
        const mentionPlugin = createMentionPlugin({
            mentionPrefix: "@",
            mentionTrigger: "@",
            entityMutability: "IMMUTABLE"
        });
        // eslint-disable-next-line no-shadow
        const { MentionSuggestions } = mentionPlugin;
        // eslint-disable-next-line no-shadow
        const plugins = [mentionPlugin];
        return { plugins, MentionSuggestions };
      }, []);

      const onOpenChange = useCallback((_open) => {
        setOpen(_open);
      }, []);
      const onSearchChange = useCallback(({value}) => {
        setSuggestions(defaultSuggestionsFilter(value, mentions));
      }, []);

    const options = {
        inlineStyles: {
          // Use a custom inline style. Default element is `span`.
            BOLD: {
                attributes: {
                    className: 'superFancyBlockquote'
                }
            },
        },
        blockStyleFn:  (block) => {
            console.log(block.getType());
            switch (block.getType()) {
                case 'blockquote': 
                    return {
                        attributes: {
                            class: 'superFancyBlockquote'
                        } 
                    };
                default: return null;
            }

        }
    };

    const outerEditorAction = () => {
        props.outerAction(
            {
                obj: convertToRaw(editorState.getCurrentContent()),
                html: stateToHTML(editorState.getCurrentContent(), options)
            }
        );
    }

    const _toggleBlockType = (blockType) => {
        setEditorState(
          RichUtils.toggleBlockType(
            editorState,
            blockType
          )
        );
      }

    const   _toggleInlineStyle = (inlineStyle) => {
        setEditorState(
            RichUtils.toggleInlineStyle(
                editorState,
                inlineStyle
            )
        );
      }

    const BLOCK_TYPES = [
        {label: 'H1', style: 'header-one'},
        {label: 'H2', style: 'header-two'},
        {label: 'H3', style: 'header-three'},
        {label: 'H4', style: 'header-four'},
        {label: 'H5', style: 'header-five'},
        {label: 'H6', style: 'header-six'},
        {label: 'Blockquote', style: 'blockquote'},
        {label: 'UL', style: 'unordered-list-item'},
        {label: 'OL', style: 'ordered-list-item'},
        {label: 'Code Block', style: 'code-block'},
        {label: 'L', style: 'left'},
        {label: 'R', style: 'right'},
        {label: 'C', style: 'center'},
    ];
    const BlockStyleControls = (props) => {
        const {editorState} = props;
        const selection = editorState.getSelection();
        const blockType = editorState
          .getCurrentContent()
          .getBlockForKey(selection.getStartKey())
          .getType();

        return (
          <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type) =>
              <StyleButton
                key={type.label}
                active={type.style === blockType}
                label={type.label}
                onToggle={props.onToggle}
                style={type.style}
              />
            )}
          </div>
        );
      };

    var INLINE_STYLES = [
        {label: 'Bold', style: 'BOLD'},
        {label: 'Italic', style: 'ITALIC'},
        {label: 'Underline', style: 'UNDERLINE'},
        {label: 'Monospace', style: 'CODE'},
    ];

    function getBlockStyle(block) {
        switch (block.getType()) {
          case 'blockquote': return 'superFancyBlockquote1';
          case 'left':
            return 'align-left';
        case 'center':
            return 'align-center';
        case 'right':
            return 'align-right';
          default: return null;
        }
    }

    const InlineStyleControls = (props) => {
        const currentStyle = props.editorState.getCurrentInlineStyle();
        
        return (
          <div className="RichEditor-controls">
            {INLINE_STYLES.map((type) =>
              <StyleButton
                key={type.label}
                active={currentStyle.has(type.style)}
                label={type.label}
                onToggle={props.onToggle}
                style={type.style}
              />
            )}
          </div>
        );
      };

    const handleChange = (passedState) => {
        let currentContent = passedState.getCurrentContent();
        let obj = convertToRaw(currentContent);
        let text = currentContent.getPlainText();
        props.outerAction(obj, text);
        setEditorState(passedState);
    }

    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            setEditorState(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    const _onBoldClick = (ev) => {
        ev.preventDefault();
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
    }
    const _onItalicClick = (ev) => {
        ev.preventDefault();
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
    }
    const _onCodeClick = (ev) => {
        ev.preventDefault();
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'CODE'));
    }
    const _onULClick = (ev) => {
        ev.preventDefault();
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
    }
    const _onSTClick = (ev) => {
        ev.preventDefault();
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'STRIKETHROUGH'));
    }

    const _onHClick = (ev) => {
        ev.preventDefault();
        setEditorState(RichUtils.toggleBlockType(editorState, ev.target.value));
    }
    const _onUListClick = (ev) => {
        ev.preventDefault();
        setEditorState(RichUtils.toggleBlockType(editorState, 'unordered-list-item'));
    }
    const _onOListClick = (ev) => {
        ev.preventDefault();
        setEditorState(RichUtils.toggleBlockType(editorState, 'ordered-list-item'));
    }

    // const EditorAction = () => {
    //     return (
    //         <div className={styles.actionSection}>
    //             <div className={styles.squareButton} onClick={_onBoldClick}>B</div>
    //             <div className={styles.squareButton} onClick={_onItalicClick}><i>I</i></div>
    //             <div className={styles.squareButton} onClick={_onULClick}><u>U</u></div>
    //             <div className={styles.squareButton} onClick={_onSTClick}><del>P</del></div>
    //             <div className={styles.squareButton} onClick={_onCodeClick}>&lt;&gt;</div>

    //             <select onChange={_onHClick}>
    //                 <option value="" disabled selected>
    //                     Select style
    //                 </option>
    //                 <option value={"header-one"} label={"Big header"}></option>
    //                 <option value={"header-two"} label={"Medium header"}></option>
    //                 <option value={"header-three"} label={"Small header"}></option>
    //                 <option value={"paragraph"} label={"Paragraph"}></option>
    //             </select>

    //             <div className={styles.squareButton} onClick={_onUListClick}>UL</div>
    //             <div className={styles.squareButton} onClick={_onOListClick}>OL</div>
    //         </div>
    //     )
    // }
    const styleMap = {
        CODE: {
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
          fontSize: 16,
          padding: 2,
        },
      };

    return <div className={editorStyles.editor}>
        <Editor
            placeholder={"Type # to attach file, @ to mention someone"}
            editorState={editorState}
            handleKeyCommand={handleKeyCommand}
            readOnly={props.readOnly}
            onChange={handleChange} 
            customStyleMap={styleMap}
            blockStyleFn={getBlockStyle}
            plugins={plugins}
            />
            <MentionSuggestions
            open={open}
            onOpenChange={onOpenChange}
            suggestions={suggestions}
            onSearchChange={onSearchChange}
            onAddMention={() => {
            // get the mention object selected
            }}
            />
        { props.readOnly ? null : 
            <>
                <div className={"sepLine"}></div>
                {/* <EditorAction /> */}
                <BlockStyleControls
                editorState={editorState}
                onToggle={_toggleBlockType}
              />
              <InlineStyleControls
                editorState={editorState}
                onToggle={_toggleInlineStyle}
              />
              <Button 
                    size="large"
                    variant="contained" 
                    color="primary"
                    onClick={()=>outerEditorAction()}>
                      Get Markup
                </Button>
                
            </>
        }
    </div>;
}

function StyleButton(props) {
    
    const onToggle = (e) => {
        e.preventDefault();
        props.onToggle(props.style);
    };

    
    let className = 'RichEditor-styleButton';
    if (props.active) {
        className += ' RichEditor-activeButton';
    }

    return (
    <span className={className} onMouseDown={onToggle}>
        {props.label}
    </span>
    );
  }

export default CustomEditor